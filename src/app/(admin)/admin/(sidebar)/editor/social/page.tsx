import { SocialMediaForm } from "@/components/forms/SocialForm";
import APIRequest from "@/lib/BackendReq";
import { socialMedia } from "@/lib/types";
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
            <SocialMediaPage searchParams={searchParams} />
        </div>
    );
}

const SocialMediaPage = async ({ searchParams }: PageProps) => {
    const { id } = await searchParams;

    if (!id) {
        return <SocialMediaForm />;
    }

    let socialMedia: socialMedia;
    try {
        const res = await APIRequest.get(`/api/social/${id}`);
        if (res.data.success) {
            socialMedia = res.data.social;
        } else {
            console.error("Failed to fetch social media data:", res.data);
            redirect(`/admin/social?error=${encodeURIComponent('Something went wrong')}`);
        }
    } catch (error) {
        console.error("Failed to fetch social media data:", error);
        redirect(`/admin/social?error=${encodeURIComponent('Something went wrong')}`);
    }
    return (
        <div>
            <SocialMediaForm socialMedia={socialMedia} />
        </div>
    );
};
