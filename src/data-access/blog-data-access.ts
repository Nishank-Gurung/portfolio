"use server";

import { Post } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export const getAllBlogs = async ():Promise<Post[]> =>{
    try {
        const blogs = await prisma.post.findMany();
        return blogs;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getBlogById = async (id: number):Promise<Post | null> =>{
    try{
         const blog = await prisma.post.findUnique({
            where: { id },
        });

        return blog;
    }catch(error){
        console.error(error);
        return null;
    }
}