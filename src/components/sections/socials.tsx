import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import { socialMedia } from "@/lib/types";
import { SocialIcon } from "./SocialIcon";
import { Skeleton } from "../ui/skeleton";

export function SocialsSection() {

    const { data: socialData, isLoading } = useQueryGetSocials();
    if (isLoading) {
        return (
            <div className="flex items-center gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton className="size-9 rounded-md" key={i} />
                ))}
            </div>
        );
    }
    const socialLinks = socialData || [];
    return (
        <>
            {socialLinks.map((social: socialMedia) => (
                <SocialIcon key={social.id} social={social} />
            ))}
        </>
    );
}
