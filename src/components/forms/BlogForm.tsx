"use client";

import { useForm, Controller } from "react-hook-form";
import { postSchema, type postSchemaType } from "@/lib/schemas";
import { format } from "date-fns";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ImageUpload } from "@/components/image-upload";
import { TagInput } from "@/components/tag-input";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import LoadingButton from "../ui/loading-button";
import { Post } from "@/generated/prisma/client";
import { useBlogMutation } from "@/hooks/mutation-hooks/blog-mutation";
import { useRouter } from "next/navigation";

const statuses = ["DRAFT", "PUBLISHED"] as const;

export function BlogForm({ blogPost }: { blogPost?: Post|null }) {
    const { createBlogMutation, updateBlogMutation } = useBlogMutation();
    const isPending = createBlogMutation.isPending || updateBlogMutation.isPending;
        const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<postSchemaType>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: blogPost?.title ?? "",
            excerpt: blogPost?.excerpt ?? "",
            content: blogPost?.content ?? "",
            status: blogPost?.status ?? "DRAFT",
            publishedAt: blogPost?.publishedAt ?? null,
            seoTitle: blogPost?.seoTitle ?? "",
            seoDescription: blogPost?.seoDescription ?? "",
            tag: blogPost?.tag ?? [],
            category: blogPost?.category ?? [],
        },
    });

    function onSubmit(data: postSchemaType) {
        if (blogPost) {
            updateBlogMutation.mutate({ id: blogPost.id, blogData: data });
            router.push("/admin/blog");
        } else {
            createBlogMutation.mutate(data);
            router.push("/admin/blog");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">Blog Post</CardTitle>
                <CardDescription>{blogPost?.id ? `Edit blog post #${blogPost.title}` : "Create a new blog post."}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Post Content</FieldLegend>
                        <FieldGroup>
                            <Field data-invalid={!!errors.title}>
                                <FieldLabel htmlFor="post-title">
                                    Title *
                                </FieldLabel>
                                <Input
                                    id="post-title"
                                    placeholder="My Blog Post Title"
                                    aria-invalid={!!errors.title}
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <FieldError>
                                        {errors.title.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Excerpt</FieldLabel>
                                <RichTextEditor
                                    value={watch("excerpt") ?? ""}
                                    onChange={(val) => setValue("excerpt", val)}
                                    placeholder="A brief summary of your post..."
                                />
                            </Field>

                            <Field data-invalid={!!errors.content}>
                                <FieldLabel>Content *</FieldLabel>
                                <RichTextEditor
                                    value={watch("content")}
                                    onChange={(val) => setValue("content", val)}
                                    placeholder="Write your post content here..."
                                    className="min-h-[250px]"
                                />
                                <FieldDescription>
                                    Use the toolbar to add headings, lists,
                                    quotes, and more.
                                </FieldDescription>
                                {errors.content && (
                                    <FieldError>
                                        {errors.content.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Cover Image</FieldLabel>
                                <ImageUpload
                                    value={watch("image") as File | undefined}
                                    onChange={(file) => setValue("image", file)}
                                    previewUrl={
                                        blogPost?.coverImage
                                            ? blogPost.coverImage
                                            : null
                                    }
                                />
                            </Field>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.status}>
                                    <FieldLabel>Status *</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger
                                                    aria-invalid={
                                                        !!errors.status
                                                    }
                                                >
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status.charAt(0) +
                                                                status
                                                                    .slice(1)
                                                                    .toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.status && (
                                        <FieldError>
                                            {errors.status.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Published Date</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="publishedAt"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(
                                                                  field.value,
                                                                  "PPP",
                                                              )
                                                            : "Pick a date"}
                                                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        selected={
                                                            field.value ??
                                                            undefined
                                                        }
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.tag}>
                                    <FieldLabel>Tags *</FieldLabel>
                                    <TagInput
                                        value={watch("tag")}
                                        onChange={(val) => setValue("tag", val)}
                                        placeholder="Add tags (press Enter)..."
                                    />
                                    <FieldDescription>
                                        Press Enter to add each tag.
                                    </FieldDescription>
                                    {errors.tag && (
                                        <FieldError>
                                            {errors.tag.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.category}>
                                    <FieldLabel>Categories *</FieldLabel>
                                    <TagInput
                                        value={watch("category")}
                                        onChange={(val) =>
                                            setValue("category", val)
                                        }
                                        placeholder="Add categories (press Enter)..."
                                    />
                                    <FieldDescription>
                                        Press Enter to add each category.
                                    </FieldDescription>
                                    {errors.category && (
                                        <FieldError>
                                            {errors.category.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator className="my-6" />

                    <FieldSet>
                        <FieldLegend>SEO Settings</FieldLegend>
                        <FieldGroup>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="post-seo-title">
                                        SEO Title
                                    </FieldLabel>
                                    <Input
                                        id="post-seo-title"
                                        placeholder="Custom SEO title"
                                        {...register("seoTitle")}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="post-seo-desc">
                                        SEO Description
                                    </FieldLabel>
                                    <Input
                                        id="post-seo-desc"
                                        placeholder="Custom meta description"
                                        {...register("seoDescription")}
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                        >
                            Reset
                        </Button>
                        <LoadingButton type="submit" loading={isPending}>
                            Save Post
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
