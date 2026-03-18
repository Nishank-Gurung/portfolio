"use client";

import { Resolver, useForm } from "react-hook-form";
import { projectSchema, projectSchemaType } from "@/lib/schemas";
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
import LoadingButton from "../ui/loading-button";
import { Project } from "@/generated/prisma/client";
import { useProjectMutation } from "@/hooks/mutation-hooks/project-mutation";
import { useRouter } from "next/navigation";

export function ProjectForm({ project }: { project?: Project | null }) {
    const { createProjectMutation, updateProjectMutation } = useProjectMutation();
    const isPending = createProjectMutation.isPending || updateProjectMutation.isPending;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<projectSchemaType>({
        resolver: zodResolver(projectSchema) as Resolver<projectSchemaType>,
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
        if (project) {
            updateProjectMutation.mutate({ id: project.id, projectData: data });
            router.push("/admin/projects");
        } else {
            createProjectMutation.mutate(data);
            router.push("/admin/projects");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">Project</CardTitle>
                <CardDescription>
                    {project?.id
                        ? `Edit project #${project.title}`
                        : "Add a new project to your portfolio."}
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
                        <LoadingButton loading={isPending} type="submit">
                            Save Project
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
