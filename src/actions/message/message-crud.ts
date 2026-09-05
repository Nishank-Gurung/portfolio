"use server";

import prisma from "@/lib/db";
import { messageSchema, messageSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth";

export const submitMessage = async (input: messageSchemaType) => {
    try {
        const validated = messageSchema.safeParse(input);
        if (!validated.success) {
            return {
                success: false,
                message: "Invalid input. Please check the fields and try again.",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        const { name, email, subject, message } = validated.data;

        const newMessage = await prisma.message.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                subject: subject?.trim() || null,
                message: message.trim(),
            },
        });

        revalidatePath("/admin/messages");

        return {
            success: true,
            message: "Message sent successfully! I'll get back to you shortly.",
            data: newMessage,
        };
    } catch (error) {
        console.error("Error submitting message:", error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const markMessageAsRead = async (id: number, isRead: boolean = true) => {
    try {
        await verifyAuth();
        const updated = await prisma.message.update({
            where: { id },
            data: { isRead },
        });

        revalidatePath("/admin/messages");
        return {
            success: true,
            message: isRead ? "Marked as read" : "Marked as unread",
            data: updated,
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const deleteMessage = async (id: number) => {
    try {
        await verifyAuth();
        await prisma.message.delete({
            where: { id },
        });

        revalidatePath("/admin/messages");
        return {
            success: true,
            message: "Message deleted successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
