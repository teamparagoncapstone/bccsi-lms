import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { username, newPassword } = await req.json();

    // Validate input
    if (!username || !newPassword) {
      return NextResponse.json({ error: 'Missing username or new password.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the password in the database
    const user = await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    });

    // Check if the user was updated
    if (!user) {
      return NextResponse.json({ error: 'User not found or password update failed.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password reset successfully.' });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}