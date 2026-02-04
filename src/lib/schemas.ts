import * as z from "zod"

export const userSchema = z.object({
    name: z.string(),
    email: z.email(),
    title: z.string().optional(),
    image: z.string().optional(),
    about: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string(),
})

export const projectSchema = z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string(),
    url: z.string(),
    techStack: z.array(z.string()),
    isFeatured: z.boolean(),
    link: z.string(),
    category: z.array(z.string()),
})

export const experienceSchema = z.object({
    company: z.string(),
    position: z.string(),
    url: z.string().optional(),
    skills: z.array(z.string()),
    startDate: z.date(),
    endDate: z.date().nullable(),
    description: z.string(),
    isCurrent: z.boolean(),
    type: z.enum(["FULL_TIME", "INTERNSHIP", "FREELANCE","CONTRACT","PART_TIME"]),
})

export const skillSchema = z.object({
    name: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
})

export const socialMediaSchema = z.object({
    platform: z.string(),
    url: z.string(),
    image: z.string(),
    order: z.number(),
})

export const educationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    description: z.string(),
    isCurrent: z.boolean(),
})

export const postSchema = z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional(),
    content: z.string(),
    coverImage: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.date().nullable(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tag: z.array(z.string()),
    category: z.array(z.string()),
})