"use client";

import { useForm, Controller, Resolver } from "react-hook-form";
import { educationSchema, type educationSchemaType } from "@/lib/schemas";
import { format } from "date-fns";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconCalendar } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";
import { Education } from "@/generated/prisma/client";
import { useEducationMutation } from "@/hooks/mutation-hooks/education-mutation";
import { useRouter } from "next/navigation";

export function EducationForm({ education }: { education?: Education | null }) {
    const [isCurrent, setIsCurrent] = useState(false);
    const { createEducationMutation, updateEducationMutation } = useEducationMutation();
    const isPending = createEducationMutation.isPending || updateEducationMutation.isPending;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<educationSchemaType>({
        resolver: zodResolver(educationSchema) as Resolver<educationSchemaType>,
        defaultValues: {
            institution: education?.institution ?? "",
            degree: education?.degree ?? "",
            fieldOfStudy: education?.field ?? "",
            description: education?.description ?? "",
            isCurrent: education?.isCurrent ?? false,
            startDate: education?.startDate ?? new Date(),
            endDate: education?.endDate ?? null,
        },
    });

    //   const isCurrent = watch("isCurrent")

    function onSubmit(data: educationSchemaType) {
        if (education) {
            updateEducationMutation.mutate({ id: education.id, educationData: data });
            router.push("/admin/education");
        } else {
            createEducationMutation.mutate(data);
            router.push("/admin/education");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">Education</CardTitle>
                <CardDescription>
                    {education?.id ? `Edit education entry #${education.institution}` : "Add an education entry to your profile."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Education Details</FieldLegend>
                        <FieldGroup>
                            <Field data-invalid={!!errors.institution}>
                                <FieldLabel htmlFor="edu-institution">
                                    Institution *
                                </FieldLabel>
                                <Input
                                    id="edu-institution"
                                    placeholder="MIT"
                                    aria-invalid={!!errors.institution}
                                    {...register("institution")}
                                />
                                {errors.institution && (
                                    <FieldError>
                                        {errors.institution.message}
                                    </FieldError>
                                )}
                            </Field>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.degree}>
                                    <FieldLabel htmlFor="edu-degree">
                                        Degree *
                                    </FieldLabel>
                                    <Input
                                        id="edu-degree"
                                        placeholder="Bachelor of Science"
                                        aria-invalid={!!errors.degree}
                                        {...register("degree")}
                                    />
                                    {errors.degree && (
                                        <FieldError>
                                            {errors.degree.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.fieldOfStudy}>
                                    <FieldLabel htmlFor="edu-field">
                                        Field of Study *
                                    </FieldLabel>
                                    <Input
                                        id="edu-field"
                                        placeholder="Computer Science"
                                        aria-invalid={!!errors.fieldOfStudy}
                                        {...register("fieldOfStudy")}
                                    />
                                    {errors.fieldOfStudy && (
                                        <FieldError>
                                            {errors.fieldOfStudy.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.startDate}>
                                    <FieldLabel>Start Date *</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="startDate"
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
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.startDate && (
                                        <FieldError>
                                            {errors.startDate.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.endDate}>
                                    <FieldLabel>End Date</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        disabled={isCurrent}
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
                                                            : isCurrent
                                                              ? "Present"
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
                                    {errors.endDate && (
                                        <FieldError>
                                            {errors.endDate.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field
                                orientation="horizontal"
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <FieldContent>
                                    <FieldLabel className="text-base">
                                        Currently Studying
                                    </FieldLabel>
                                    <FieldDescription>
                                        Toggle if you are currently enrolled.
                                    </FieldDescription>
                                </FieldContent>
                                <Switch
                                    checked={isCurrent}
                                    onCheckedChange={(checked) => {
                                        setIsCurrent(checked);
                                        setValue("isCurrent", checked);
                                        if (checked) {
                                            setValue("endDate", null);
                                        }
                                    }}
                                />
                            </Field>

                            <Field data-invalid={!!errors.description}>
                                <FieldLabel>Description *</FieldLabel>
                                <RichTextEditor
                                    value={watch("description")}
                                    onChange={(val) =>
                                        setValue("description", val)
                                    }
                                    placeholder="Describe your studies, achievements, or coursework..."
                                />
                                {errors.description && (
                                    <FieldError>
                                        {errors.description.message}
                                    </FieldError>
                                )}
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
                            Save Education
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
