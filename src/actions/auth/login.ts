"use server";

import prisma from "@/lib/db";
import { loginSchema, loginSchemaType } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { ApiError } from "next/dist/server/api-utils";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (data: loginSchemaType) => {
    try {
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }

        const { email, password } = result.data;
        console.log(email);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                success: false,
                message: "Invalid credentials",
                data: null,
            };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return {
                success: false,
                message: "Invalid credentials",
                data: null,
            };
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        const cookieStore = await cookies();

        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            success: true,
            message: "Login successful",
        };
    } catch (err) {
        if (err instanceof ApiError || err instanceof Error) {
            return {
                success: false,
                message: err.message || "Internal server error",
                data: null,
            };
        }
        return { success: false, message: "Something went wrong" };
    }
};
