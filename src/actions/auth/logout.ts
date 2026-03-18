"use server";
import { cookies } from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");
        return {
            success: true,
            message: "Logout successful",
        };
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: "Something went wrong",
        };
    }
};
