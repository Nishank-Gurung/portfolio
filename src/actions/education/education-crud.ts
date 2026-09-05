"use server";

import prisma from "@/lib/db";
import { educationSchema, educationSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";

export const createEducation = async (educationData: educationSchemaType) => {
    try {
        await verifyAuth();
        const result = educationSchema.safeParse(educationData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;

        const newEducation = await prisma.$transaction(async (tx) => {
            const edu = await tx.education.create({
                data: {
                    institution: data.institution,
                    degree: data.degree,
                    field: data.fieldOfStudy,
                    description: data.description,
                    isCurrent: data.isCurrent,
                    startDate: data.startDate,
                    endDate: data.endDate,
                },
            });
            return edu;
        });

        return {
            success: true,
            message: "Education created successfully",
            data: newEducation,
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

export const deleteEducation = async (id: number) => {
    try {
        await verifyAuth();
        await prisma.education.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Education deleted successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

interface UpdateEducationProps {
    id: number;
    educationData: educationSchemaType;
}
export const updateEducation = async (
    { id, educationData }: UpdateEducationProps
) => {
    try {
        await verifyAuth();
        const existingEducation = await prisma.education.findUnique({
            where: { id },
        });

        if (!existingEducation) {
            throw new Error("Education not found");
        }
        const result = educationSchema.safeParse(educationData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;

        const updatedEducation = await prisma.$transaction(async (tx) => {
            const edu = await tx.education.update({
                where: { id },
                data: {
                    institution: data.institution,
                    degree: data.degree,
                    field: data.fieldOfStudy,
                    description: data.description,
                    isCurrent: data.isCurrent,
                    startDate: data.startDate,
                    endDate: data.endDate,
                },
            });
            return edu;
        });

        return {
            success: true,
            message: "Education updated successfully",
            data: updatedEducation,
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
