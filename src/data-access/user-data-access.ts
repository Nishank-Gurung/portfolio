"use server";

import prisma from "@/lib/db";


export const getUser= async () =>{
    try {
        const user = await prisma.user.findFirst();
        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}