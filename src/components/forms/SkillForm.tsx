"use client";

import { useForm, Controller } from "react-hook-form";
import { skillSchema, type skillSchemaType } from "@/lib/schemas";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
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
import { ImageUpload } from "@/components/image-upload";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { skill } from "@/lib/types";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import APIRequest from "@/lib/BackendReq";

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

export function SkillForm({ skill }: { skill?: skill }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<skillSchemaType>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: skill?.name ?? "",
            category: skill?.category ?? "",
            level: skill?.level ?? undefined,
        },
    });

    function onSubmit(data: skillSchemaType) {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                if (data.category) formData.append("category", data.category);
                if (data.level) formData.append("level", data.level);
                if (data.image) formData.append("image", data.image);
                const response = await APIRequest.post("api/skill", formData);
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push("/admin/skills");
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
                <CardTitle className="text-foreground">Skill</CardTitle>
                <CardDescription>
                    Add a new skill to your profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Skill Details</FieldLegend>
                        <FieldGroup>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="skill-name">
                                        Name *
                                    </FieldLabel>
                                    <Input
                                        id="skill-name"
                                        placeholder="React"
                                        aria-invalid={!!errors.name}
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <FieldError>
                                            {errors.name.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="skill-category">
                                        Category
                                    </FieldLabel>
                                    <Input
                                        id="skill-category"
                                        placeholder="Frontend"
                                        {...register("category")}
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel>Level</FieldLabel>
                                <Controller
                                    control={control}
                                    name="level"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select skill level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem
                                                        key={level}
                                                        value={level}
                                                    >
                                                        {level.charAt(0) +
                                                            level
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Skill Icon</FieldLabel>
                                <ImageUpload
                                    value={watch("image") as File | undefined}
                                    onChange={(file) => setValue("image", file)}
                                    previewUrl={
                                        skill?.image ? skill.image : null
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
                            Save Skill
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
