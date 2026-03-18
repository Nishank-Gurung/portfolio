import { ProjectForm } from "@/components/forms/ProjectForm";
import { getProjectById } from "@/data-access/project-data-access";
import { Project } from "@/generated/prisma/client";

import { notFound } from "next/navigation";

interface PageProps {
    searchParams: Promise<{
        id: string;
    }>;
}
export default function page({ searchParams }: PageProps) {
    return (
        <div>
            <ProjectPage searchParams={searchParams} />
        </div>
    );
}

const ProjectPage = async ({ searchParams }: PageProps) => {
    const { id } = await searchParams;

    
    let project: Project | null = null;
    if (id) {
        project = await getProjectById(Number(id));
        if (!project) {
            notFound();
        }
    }
    
    return (
        <div>
            <ProjectForm project={project} />
        </div>
    );
};
