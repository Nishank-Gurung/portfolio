import { SkillForm } from "@/components/forms/SkillForm";
import APIRequest from "@/lib/BackendReq";
import { skill } from "@/lib/types";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{
        id: string;
    }>;
}
export default function page({ searchParams }: PageProps) {
    return (
        <div>
            <SkillPage searchParams={searchParams} />
        </div>
    );
}

const SkillPage = async ({ searchParams }: PageProps) => {
    const { id } = await searchParams;

    if (!id) {
        return <SkillForm />;
    }

    let skill: skill;
    try {
        const res = await APIRequest.get(`/api/skill/${id}`);
        if (res.data.success) {
            skill = res.data.skill;
        } else {
            console.error("Failed to fetch skill data:", res.data);
            redirect(`/admin/skill?error=${encodeURIComponent('Something went wrong')}`);
        }
    } catch (error) {
        console.error("Failed to fetch skill data:", error);
        redirect(`/admin/skill?error=${encodeURIComponent('Something went wrong')}`);
    }
    return (
        <div>
            <SkillForm skill={skill} />
        </div>
    );
};
