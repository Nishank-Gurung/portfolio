"use server";

import prisma from "@/lib/db";
import { experienceSchema, experienceSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";

export const createWork = async (workData: experienceSchemaType) => {
    try {
        await verifyAuth();
        const result = experienceSchema.safeParse(workData);

        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;
        const newWork = await prisma.workExperience.create({
            data: {
                ...data,
            },
        });

        return {
            success: true,
            message: "Work experience created successfully",
            data: newWork,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};

export const deleteWork = async (id: number) => {
    try {
        await verifyAuth();
        await prisma.workExperience.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Work experience deleted successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

interface UpdateWorkProps {
    id: number;
    workData: experienceSchemaType;
}
export const updateWork = async (
    { id, workData }: UpdateWorkProps
) => {
    try {
        await verifyAuth();
        const existingWork = await prisma.workExperience.findUnique({
            where: { id },
        });

        if (!existingWork) {
            throw new Error("Work experience not found");
        }

        const result = experienceSchema.safeParse(workData);

        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;

        const updatedWork = await prisma.$transaction(async (tx) => {
            const updated = await tx.workExperience.update({
                where: { id: id },
                data: {
                    ...data,
                },
            });
            return updated;
        });
        return {
            success: true,
            message: "Work experience updated successfully",
            data: updatedWork,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};
