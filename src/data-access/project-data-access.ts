"use server";

import { Project } from "@/generated/prisma/client";
import prisma from "@/lib/db";


export const getAllProjects = async ():Promise<Project[]> =>{
    try {
        const projects = await prisma.project.findMany();
        return projects;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getProjectById = async (id: number):Promise<Project | null> =>{
    try{
         const project = await prisma.project.findUnique({
            where: { id },
        });

        return project;
    }catch(error){
        console.error(error);
        return null;
    }
}