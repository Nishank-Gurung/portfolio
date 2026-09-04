export type user = {
    id: number;
    name: string;
    email: string;
    title?: string;
    image?: string;
    fileId?: string;
    about?: string;
    phone?: string;
    resumeUrl?: string;
    resumeFileId?: string;
    role?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

export type message = {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    fileId: string;
    url: string;
    techStack: string[];
    isFeatured: boolean;
    link: string;
    category: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type experience = {
    id: number;
    company: string;
    position: string;
    url?: string;
    skills: string[];
    startDate: Date;
    endDate: Date | null;
    description: string;
    isCurrent: boolean;
    type: "FULL_TIME" | "INTERNSHIP" | "FREELANCE" | "CONTRACT" | "PART_TIME";
    createdAt: Date;
    updatedAt: Date;
};

export type skill = {
    id: number;
    name: string;
    image?: string;
    fileId?: string;
    category?: string;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    createdAt: Date;
    updatedAt: Date;
};

export type socialMedia = {
    id: number;
    platform: string;
    url: string;
    image: string;
    fileId: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

export type education = {
    id: number;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type post = {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    fileId?: string;
    status: "DRAFT" | "PUBLISHED";
    publishedAt: Date | null;
    authorId: number;
    seoTitle?: string;
    seoDescription?: string;
    tag: string[];
    category: string[];
    postViews: number;
    createdAt: Date;
    updatedAt: Date;
};
