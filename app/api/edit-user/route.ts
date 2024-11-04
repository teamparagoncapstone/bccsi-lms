import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { logAudit } from '@/lib/auditLogger'; 

enum Role {
  Administrator = 'Administrator',
  Teacher = 'Teacher',
  Student = 'Student',
}

interface UpdateUserRequestBody {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  image: string;
}

interface DeleteUserRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateUserRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {
      name: body.name,
      username: body.username,
      email: body.email,
      role: body.role,
      image: body.image,
    };

   
    if (body.password) {
      updateData.password = await hash(body.password, 12);
    }

   
    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: updateData,
    });

 
    await logAudit(body.id, 'Update User', 'User', `Updated user : ${body.name}`);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteUserRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    
    const deletedUser = await prisma.user.delete({
      where: { id: body.id },
    });

   
    await logAudit(body.id, 'DELETE', 'User', `Deleted user with ID: ${body.id}`);

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}