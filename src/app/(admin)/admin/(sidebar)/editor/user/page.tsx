import { UserForm } from "@/components/forms/UserForm";
import { getUser } from "@/data-access/user-data-access";
import { User } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export default function page() {
    return (
        <div>
            <UserContent />
        </div>
    );
}

const UserContent = async () => {
    let user: User | null = null;

    user = await getUser();
    if (!user) {
        notFound();
    }
    return (
        <div>
            <UserForm user={user} />
        </div>
    );
};
