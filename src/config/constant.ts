import {
    IconSocial,
    TablerIcon,
    IconStar,
    IconTools,
    IconFolderRoot,
    IconUser,
} from "@tabler/icons-react";

export const TOKEN_NAME = "portfolio-token";

export const ADMIN_DEFAULT_REDIRECT_URL = "/admin/dashboard";

export interface SidebarNavLinks {
    title: string;
    url: string;
    icon?: TablerIcon;
    items?: {
        title: string;
        url: string;
        icon?: TablerIcon;
    }[];
}
export const AdminSideBarLinks: SidebarNavLinks[] = [
    {
        title: "User",
        icon: IconUser,
        url: "/admin/user",
    },
    {
        title: "Projects",
        icon: IconFolderRoot,
        url: "/admin/projects",
    },
    {
        title: "Experiences",
        icon: IconStar,
        url: "/admin/experiences",
    },

    {
        title: "Skills",
        icon: IconTools,
        url: "/admin/skills",
    },

    {
        title: "Socials",
        icon: IconSocial,
        url: "/admin/socials",
    },
];
