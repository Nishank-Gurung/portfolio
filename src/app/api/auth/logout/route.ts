import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({
            success: true,
            message: "Logout Successful",
        });
        res.cookies.delete("auth_token");
        return res;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error,
        });
    }
}
