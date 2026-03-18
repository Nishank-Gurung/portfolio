"use server";

import { SocialMedia } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export const getAllSocials = async (): Promise<SocialMedia[]> => {
    try {
        const socials = await prisma.socialMedia.findMany();
        return socials;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getSocialById = async (
    id: number,
): Promise<SocialMedia | null> => {
    try {
        const social = await prisma.socialMedia.findUnique({
            where: {
                id,
            },
        });
        return social;
    } catch (error) {
        console.error(error);
        return null;
    }
};
