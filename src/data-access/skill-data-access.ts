"use server";

import { Skill } from "@/generated/prisma/client";
import prisma from "@/lib/db";


export const getAllSkills = async (): Promise<Skill[]> => {
    try {
        const skills = await prisma.skill.findMany();
        return skills;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getSkillById = async (id: number): Promise<Skill | null> => {
    try{
         const skill = await prisma.skill.findUnique({
            where: { id },
        });

        return skill;
    }catch(error){
        console.error(error);
        return null;
    }
}