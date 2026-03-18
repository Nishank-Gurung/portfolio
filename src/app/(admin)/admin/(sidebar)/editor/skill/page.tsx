import { SkillForm } from "@/components/forms/SkillForm";
import { getSkillById } from "@/data-access/skill-data-access";
import { Skill } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

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

    
    let skill: Skill | null = null;
    if (id) {
        skill = await getSkillById(Number(id));
        if (!skill) {
            notFound();
        }
    }
    
    return (
        <div>
            <SkillForm skill={skill} />
        </div>
    );
};
