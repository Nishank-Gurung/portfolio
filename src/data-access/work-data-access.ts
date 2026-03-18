"use server";

import prisma from "@/lib/db";


export const getAllWorks = async () => {
    try {
        const works = await prisma.workExperience.findMany();
        return works;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getWorkById = async (id: number) => {
    try{
         const work = await prisma.workExperience.findUnique({
            where: { id },
        });

        return work;
    }catch(error){
        console.error(error);
        return null;
    }
}