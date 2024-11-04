import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const logs = await prisma.auditLogs.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            include: {
                user: { 
                    select: {
                        name: true, 
                    },
                },
            },
        });

       
        const formattedLogs = logs.map(log => ({
            ...log,
            userId: log.user?.name || log.userId,
        }));

        return NextResponse.json(formattedLogs);
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json({
            status: 'error',
            message: 'An error occurred while fetching logs',
        }, { status: 500 });
    }
}