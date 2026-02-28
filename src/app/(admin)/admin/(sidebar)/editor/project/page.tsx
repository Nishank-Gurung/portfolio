import { ProjectForm } from "@/components/forms/ProjectForm";
import APIRequest from "@/lib/BackendReq";
import { project } from "@/lib/types";
import axios from "axios";
import { redirect } from "next/navigation";

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

    if (!id) {
        return <ProjectForm />;
    }

    let project: project;
    try {
        const res = await APIRequest.get(`/api/project/${id}`);
        if (res.data.success) {
            project = res.data.project;
        } else {
            console.error("Failed to fetch project data:", res.data);
            redirect(`/admin/project?error=${encodeURIComponent('Something went wrong')}`);
        }
    } catch (error) {
        console.error("Failed to fetch project data:", error);
        redirect(`/admin/project?error=${encodeURIComponent('Something went wrong')}`);
    }
    return (
        <div>
            <ProjectForm project={project} />
        </div>
    );
};
