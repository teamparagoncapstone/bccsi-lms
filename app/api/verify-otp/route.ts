import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { username, otp } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });
  
  if (!user) {
    return NextResponse.json({ status: 'error', message: 'User not found.' }, { status: 400 });
  }

  const otpEntry = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      otp,
      isUsed: false,
    },
  });

  if (!otpEntry || new Date() > otpEntry.expiresAt) {
    return NextResponse.json({ status: 'error', message: 'Invalid or expired OTP.' }, { status: 400 });
  }

  
  await prisma.oTP.update({
    where: { id: otpEntry.id },
    data: { isUsed: true },
  });

  return NextResponse.json({ status: 'success', message: 'OTP verified.' });
}