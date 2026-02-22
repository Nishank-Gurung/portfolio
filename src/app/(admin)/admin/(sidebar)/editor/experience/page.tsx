import WorkForm from "@/components/forms/WorkForm";
import APIRequest from "@/lib/BackendReq";
import { experience } from "@/lib/types";
import { redirect } from "next/navigation";

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

    if (!id) {
        return <WorkForm />;
    }

    let experience: experience;
    try {
        const res = await APIRequest.get(`/api/work/${id}`);
        if (res.data.success) {
            experience = res.data.work;
        } else {
            console.error("Failed to fetch experience data:", res.data);
            redirect(`/admin/experience?error=${encodeURIComponent('Something went wrong')}`);
        }
    } catch (error) {
        console.error("Failed to fetch experience data:", error);
        redirect(`/admin/experience?error=${encodeURIComponent('Something went wrong')}`);
    }
    return (
        <div>
            <WorkForm experience={experience} />
        </div>
    );
};
