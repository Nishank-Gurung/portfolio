import { SocialMediaForm } from "@/components/forms/SocialForm";
import { getSocialById } from "@/data-access/social-data-access";
import { SocialMedia } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

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

    
    let socialMedia: SocialMedia| null = null;
    
    
    if (id) {
      socialMedia = await getSocialById(Number(id));
      if (!socialMedia) {
        notFound()
      }
    }
    
    return (
        <div>
            <SocialMediaForm socialMedia={socialMedia} />
        </div>
    );
};
