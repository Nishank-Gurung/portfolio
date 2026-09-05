import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface SessionUser {
    id: number;
    role: string;
}

/**
 * Verifies that the incoming Server Action call is made by an authenticated administrator.
 * Reads the `auth_token` HTTP-only cookie and verifies its JWT signature.
 * 
 * @throws {Error} If no valid session token exists or verification fails.
 * @returns {Promise<SessionUser>} The decoded authenticated session user.
 */
export async function verifyAuth(): Promise<SessionUser> {
    let token: string | undefined;

    try {
        const cookieStore = await cookies();
        token = cookieStore.get("auth_token")?.value;
    } catch {
        throw new Error("Unauthorized: No active request session");
    }

    if (!token) {
        throw new Error("Unauthorized: Please log in to perform this action");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Internal Server Error: Missing JWT_SECRET configuration");
    }

    try {
        const decoded = jwt.verify(token, secret) as SessionUser;
        if (!decoded || !decoded.id) {
            throw new Error("Unauthorized: Invalid session payload");
        }
        return decoded;
    } catch {
        throw new Error("Unauthorized: Session expired or invalid");
    }
}
