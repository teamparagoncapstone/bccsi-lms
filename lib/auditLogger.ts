import { prisma } from "@/lib/prisma";

export const logAudit = async (userId: string | null, action: string, entityId: string, details?: string) => {
    await prisma.auditLogs.create({
        data: {
            userId,
            action,
            entityId,
            details,
        },
    });
};