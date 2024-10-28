import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// PUT method to update educator profile
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const educatorId = searchParams.get('educatorId');

    // Check if educator ID is provided
    if (!educatorId) {
        return NextResponse.json({ status: 'error', message: 'Educator ID not provided' }, { status: 400 });
    }

    try {
        // Parse the request body
        const requestBody = await req.json();
        console.log("Request body:", requestBody);
        
        // Find the educator in the database
        const educator = await prisma.educator.findUnique({
            where: { id: educatorId },
            include: { user: true },
        });

        // If educator not found, return 404 error
        if (!educator) {
            return NextResponse.json({ status: 'error', message: 'Educator not found' }, { status: 404 });
        }

        // Destructure request body
        const { name, username, email, password } = requestBody;

        // Prepare data for user update
        const userUpdateData: any = { name, username, email };

        // If password is provided, hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            userUpdateData.password = hashedPassword;
        }

        // Update educator and associated user
        const updatedEducator = await prisma.educator.update({
            where: { id: educatorId },
            data: {
                ...userUpdateData,
                user: {
                    update: userUpdateData,
                },
            },
            include: { user: true },
        });

        // Return success response with updated educator
        return NextResponse.json({ status: 'success', updatedEducator });
    } catch (error) {
        console.error("Error during profile update:", error);
        return NextResponse.json({ status: 'error', message: 'Error updating profile' }, { status: 500 });
    }
}