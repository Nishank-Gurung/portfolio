import WorkForm from "@/components/forms/WorkForm";
import { getWorkById } from "@/data-access/work-data-access";
import { WorkExperience } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

interface PageProps {
    searchParams: Promise<{
        id: string;
    }>;
}

export default function page({ searchParams }: PageProps) {
    return (
        <div>
            <WorkPage searchParams={searchParams} />
        </div>
    );
}

const WorkPage = async ({ searchParams }: PageProps) => {
    const { id } = await searchParams;

    
    let experience: WorkExperience | null = null;
    
    if (id) {
        experience = await getWorkById(Number(id));
        if (!experience) {
            notFound();
        
        }
    }
    return (
        <div>
            <WorkForm experience={experience} />
        </div>
    );
};
