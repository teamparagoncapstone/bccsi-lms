import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from "@/lib/prisma"; 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpEmail = async (email: string, otp: string) => {
  const htmlContent = `
  <div style="font-size: 20px; font-family: Arial, sans-serif;">
    <h2>OTP Code</h2>
    <p style="font-size: 20px; font-weight: bold;">Your OTP code is <span style="font-size: 24px; color: blue;">${otp}</span>.</p>
    <p>It is valid for 2 minutes.</p>
  </div>`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: htmlContent,
  });
};

// Function to request OTP
const requestOtp = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.email) {
    throw new Error('User not found or email not set');
  }

  const otp = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 2); 

  await prisma.oTP.create({
    data: {
      userId: user.id,
      otp,
      expiresAt,
    },
  });

  await sendOtpEmail(user.email, otp);
};

// Handler
export async function POST(req: Request) {
  const { username } = await req.json();
  await requestOtp(username);
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}