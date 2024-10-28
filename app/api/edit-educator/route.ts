import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { logAudit } from '@/lib/auditLogger'; 

enum EducatorLevel {
  EducatorOne = 'EducatorOne',
  EducatorTwo = 'EducatorTwo',
  EducatorThree = 'EducatorThree',
}

interface UpdateEducatorRequestBody {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  educatorLevel: EducatorLevel;
  image: string;
}

interface DeleteEducatorRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateEducatorRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Educator ID is required' }, { status: 400 });
    }

    const updateData: any = {
      name: body.name,
      username: body.username,
      email: body.email,
      educatorLevel: body.educatorLevel,
      image: body.image,
    };

    
    if (body.password) {
      updateData.password = await hash(body.password, 12);
    }

    
    const updatedEducator = await prisma.educator.update({
      where: { id: body.id },
      data: updateData,
    });

    
    if (updatedEducator.userId) {
      await prisma.user.update({
        where: { id: updatedEducator.userId },
        data: {
          username: body.username,
          email: body.email,
          name: body.name,
          image: body.image,
        },
      });
    } else {
      return NextResponse.json({ error: 'Associated user not found' }, { status: 404 });
    }

    // Log the educator update action
    await logAudit(updatedEducator.userId, 'Update Educator', 'Educator', `Updated educator : ${body.username}`);

    return NextResponse.json(updatedEducator);
  } catch (error) {
    console.error('Error updating educator:', error);
    return NextResponse.json({ error: 'Failed to update educator' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteEducatorRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Educator ID is required' }, { status: 400 });
    }

   
    const educator = await prisma.educator.findUnique({
      where: { id: body.id },
      select: { userId: true },
    });

    if (!educator || !educator.userId) {
      return NextResponse.json({ error: 'Educator or associated user not found' }, { status: 404 });
    }

    
    const deletedEducator = await prisma.educator.delete({
      where: { id: body.id },
    });

    
    await prisma.user.delete({
      where: { id: educator.userId },
    });

    
    await logAudit(educator.userId, 'Delete Educator', 'Educator', `Deleted educator with ID: ${body.id}`);

    return NextResponse.json(deletedEducator);
  } catch (error) {
    console.error('Error deleting educator:', error);
    return NextResponse.json({ error: 'Failed to delete educator' }, { status: 500 });
  }
}