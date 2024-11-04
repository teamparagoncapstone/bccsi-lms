import { prisma } from "@/lib/prisma";

export const logAudit = async (userId: string | null, action: string, entityId: string, details?: string) => {
    if (!userId) {
       
        await prisma.auditLogs.create({
            data: {
                userId: null, 
                userName: "Unknown User", 
                action,
                entityId,
                details,
            },
        });
        return; 
    }

   
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
    });

    await prisma.auditLogs.create({
        data: {
            userId, 
            userName: user?.name || "Unknown User", 
            action,
            entityId,
            details,
        },
    });
};