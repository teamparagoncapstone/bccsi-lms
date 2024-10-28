import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found or does not have a valid email address' }, { status: 404 });
    }


    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    
    await prisma.oTP.create({
      data: {
        userId: user.id,
        otp: otpCode,
        expiresAt: otpExpiry,
      },
    });

   
    await transporter.sendMail({
      to: user.email,
      subject: 'Your OTP Code for Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Your OTP code is <strong style="font-size: 24px;">${otpCode}</strong>.</p>
          <p>It is valid for the next 2 minutes.</p>
        </div>
      `, 
    });

    return NextResponse.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}