"use server";

import { Education } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export const getAllEducation = async (): Promise<Education[]> => {
    try {
        const education = await prisma.education.findMany();
        return education;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getEducationById = async (id: number): Promise<Education | null> => {
    try{
         const education = await prisma.education.findUnique({
            where: { id },
        });

        return education;
    }catch(error){
        console.error(error);
        return null;
    }
}