import * as z from "zod";

export const userSchema = z.object({
    name: z.string(),
    email: z.email(),
    title: z.string().optional(),
    image: z.file().optional(),
    about: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().optional(),
});
export type userSchemaType = z.infer<typeof userSchema>;

export const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z.instanceof(File).optional(),
    url: z.string(),
    techStack: z.array(z.string()),
    isFeatured: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean(),
    ),
    category: z.array(z.string()),
});
export type projectSchemaType = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
    company: z.string(),
    position: z.string(),
    url: z.string().optional(),
    skills: z.array(z.string()),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    description: z.string(),
    isCurrent: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean(),
    ),
    type: z.enum([
        "FULL_TIME",
        "INTERNSHIP",
        "FREELANCE",
        "CONTRACT",
        "PART_TIME",
    ]),
});
export type experienceSchemaType = z.infer<typeof experienceSchema>;

export const skillSchema = z.object({
    name: z.string(),
    image: z.instanceof(File).optional(),
    category: z.string().optional(),
    level: z
        .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
        .optional(),
});
export type skillSchemaType = z.infer<typeof skillSchema>;

export const socialMediaSchema = z.object({
    platform: z.string(),
    url: z.string(),
    image: z.instanceof(File).optional(),
    order: z.coerce.number(),
});
export type socialMediaSchemaType = z.infer<typeof socialMediaSchema>;

export const educationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    description: z.string(),
    isCurrent: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean(),
    ),
});
export type educationSchemaType = z.infer<typeof educationSchema>;

export const postSchema = z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    content: z.string(),
    image: z.instanceof(File).optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.date().nullable(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tag: z.array(z.string()),
    category: z.array(z.string()),
});
export type postSchemaType = z.infer<typeof postSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type loginSchemaType = z.infer<typeof loginSchema>;
