import { socialMedia } from "@/lib/types";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconMail } from "@tabler/icons-react";

const iconMap: Record<string, React.ElementType> = {
  GitHub: IconBrandGithub,
  LinkedIn: IconBrandLinkedin,
  X: IconBrandTwitter,
  Email: IconMail,
};
export function SocialIcon({ social }: { social: socialMedia }) {
      const Icon = iconMap[social.platform] || IconMail;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" asChild>
                    <a
                        href={social.url}
                        target={
                            social.platform !== "Email" ? "_blank" : undefined
                        }
                        rel={
                            social.platform !== "Email"
                                ? "noopener noreferrer"
                                : undefined
                        }
                        aria-label={social.platform}
                    >
                        <Icon className="size-4" />
                        {/* <img
                            src={social.image}
                            alt={social.platform}
                            className="size-4 object-contain"
                        /> */}
                    </a>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{social.platform}</TooltipContent>
        </Tooltip>
    );
}
