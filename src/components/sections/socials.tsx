import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import { socialMedia } from "@/lib/types";
import { SocialIcon } from "./SocialIcon";

export function SocialsSection() {

     const { data: socialData, isLoading } = useQueryGetSocials();
    if (isLoading) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }
         const socialLinks = socialData?.data.social || [];
    return(
        <>
            {socialLinks.map((social: socialMedia) => (
                <SocialIcon key={social.id} social={social} />
            ))}
        </>
    )
}