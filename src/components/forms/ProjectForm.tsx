"use client";

import { useForm } from "react-hook-form";
import { projectSchema, type projectSchemaType } from "@/lib/schemas";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { project } from "@/lib/types";
import { useTransition } from "react";
import { start } from "repl";
import APIRequest from "@/lib/BackendReq";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";

export function ProjectForm({ project }: { project?: project }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<projectSchemaType>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title ?? "",
            description: project?.description ?? "",
            url: project?.url ?? "",
            techStack: project?.techStack ?? [],
            isFeatured: project?.isFeatured ?? false,
            category: project?.category ?? [],
        },
    });

    function onSubmit(data: projectSchemaType) {
        console.log("Project form data:", data);
        // toast.success("Project saved successfully!")
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("title", data.title);
                formData.append("description", data.description);
                formData.append("url", data.url);
                formData.append("isFeatured", String(data.isFeatured));
                data.techStack.forEach((tech, index) => {
                    formData.append(`techStack[${index}]`, tech);
                });
                data.category.forEach((cat, index) => {
                    formData.append(`category[${index}]`, cat);
                });
                if (data.image) {
                    formData.append("image", data.image);
                }
                const response = await APIRequest.post(
                    project ? `api/projects/${project.id}` : "api/projects",
                    formData,
                );
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push("/admin/project");
                } else {
                    showErrorTost(response.data.message);
                }
            } catch (error) {
                console.log(error);
                showErrorTost(error);
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">Project</CardTitle>
                <CardDescription>
                    Add a new project to your portfolio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Project Details</FieldLegend>
                        <FieldGroup>
                            <Field data-invalid={!!errors.title}>
                                <FieldLabel htmlFor="project-title">
                                    Title *
                                </FieldLabel>
                                <Input
                                    id="project-title"
                                    placeholder="My Awesome Project"
                                    aria-invalid={!!errors.title}
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <FieldError>
                                        {errors.title.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field data-invalid={!!errors.description}>
                                <FieldLabel>Description *</FieldLabel>
                                <RichTextEditor
                                    value={watch("description")}
                                    onChange={(val) =>
                                        setValue("description", val)
                                    }
                                    placeholder="Describe what the project does..."
                                />
                                {errors.description && (
                                    <FieldError>
                                        {errors.description.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field data-invalid={!!errors.url}>
                                <FieldLabel htmlFor="project-url">
                                    URL *
                                </FieldLabel>
                                <Input
                                    id="project-url"
                                    placeholder="https://myproject.com"
                                    aria-invalid={!!errors.url}
                                    {...register("url")}
                                />
                                {errors.url && (
                                    <FieldError>
                                        {errors.url.message}
                                    </FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Project Image</FieldLabel>
                                <ImageUpload
                                    value={watch("image") as File | undefined}
                                    onChange={(file) => setValue("image", file)}
                                    previewUrl={project ? project.image : null}
                                />
                            </Field>

                            <Field data-invalid={!!errors.techStack}>
                                <FieldLabel>Tech Stack *</FieldLabel>
                                <TagInput
                                    value={watch("techStack")}
                                    onChange={(val) =>
                                        setValue("techStack", val)
                                    }
                                    placeholder="Add technologies (press Enter)..."
                                />
                                <FieldDescription>
                                    Press Enter to add each technology.
                                </FieldDescription>
                                {errors.techStack && (
                                    <FieldError>
                                        {errors.techStack.message}
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

                            <Field
                                orientation="horizontal"
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <FieldContent>
                                    <FieldLabel className="text-base">
                                        Featured Project
                                    </FieldLabel>
                                    <FieldDescription>
                                        Display this project prominently on your
                                        portfolio.
                                    </FieldDescription>
                                </FieldContent>
                                <Switch
                                    checked={watch("isFeatured")}
                                    onCheckedChange={(checked) =>
                                        setValue("isFeatured", checked)
                                    }
                                />
                            </Field>
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
                        <LoadingButton loading={isPending} type="submit">Save Project</LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
