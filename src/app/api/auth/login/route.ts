import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { loginSchema } from "@/lib/schemas";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        console.log("checkpoint 1");

        const formData = await req.formData();
        console.log(formData);
        const rawData = Object.fromEntries(formData.entries());

        const result = loginSchema.safeParse(rawData);
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    details: result.error.message,
                },
                { status: 400 },
            );
        }
        const { email, password } = result.data;
        console.log(email);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 },
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 },
            );
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        const res = NextResponse.json({
            success: true,
            message: "Login successful",
        });
        res.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res;
    } catch (error) {
        console.log("first");
        return NextResponse.json(
            {
                success: false,
                message: error,
            },
            {
                status: 500,
            },
        );
    }
}
