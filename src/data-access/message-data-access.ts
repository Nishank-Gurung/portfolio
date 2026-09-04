import prisma from "@/lib/db";

export const getMessages = async () => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const getUnreadMessageCount = async () => {
    try {
        const count = await prisma.message.count({
            where: {
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        console.error("Error fetching unread message count:", error);
        return 0;
    }
};
