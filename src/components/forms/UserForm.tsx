"use client";

import { useForm } from "react-hook-form";
import { userSchema, type userSchemaType } from "@/lib/schemas";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
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
import { User } from "@/generated/prisma/client";
import { useUserMutation } from "@/hooks/mutation-hooks/user-mutation";
import { useRouter } from "next/navigation";
import {
    IconCheck,
    IconExternalLink,
    IconFileText,
    IconUpload,
    IconX,
} from "@tabler/icons-react";

export function UserForm({ user }: { user?: User | null }) {
    const { updateUserMutation } = useUserMutation();
    const isPending = updateUserMutation.isPending;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<userSchemaType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            title: user?.title ?? "",
            about: user?.about ?? "",
            phone: user?.phone ?? "",
            address: user?.address ?? "",
            password: "",
        },
    });

    function onSubmit(data: userSchemaType) {
        updateUserMutation.mutate(data);
        router.push("/admin/user");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-foreground">User Profile</CardTitle>
                <CardDescription>
                   {user?.id ? `Edit user profile #${user.name}` : "Manage your personal information and account settings."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Personal Information</FieldLegend>
                        <FieldGroup>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Profile Image</FieldLabel>
                                    <ImageUpload
                                        value={watch("image") as File | undefined}
                                        onChange={(file) => setValue("image", file)}
                                        previewUrl={user?.image ? user.image : null}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Curriculum Vitae / Resume (PDF)</FieldLabel>
                                    <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 hover:border-accent/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                                                <IconFileText className="size-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">
                                                    {watch("resume")
                                                        ? (watch("resume") as File).name
                                                        : user?.resumeUrl
                                                        ? "Current Resume (Uploaded)"
                                                        : "No Resume Uploaded"}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    PDF document (Max 10MB)
                                                </p>
                                            </div>
                                        </div>

                                        {user?.resumeUrl && !watch("resume") && (
                                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                                                    <IconCheck className="size-3.5" />
                                                    Active on Portfolio
                                                </span>
                                                <a
                                                    href={user.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                                                >
                                                    View Current PDF
                                                    <IconExternalLink className="size-3" />
                                                </a>
                                            </div>
                                        )}

                                        <div className="pt-2 flex items-center gap-2">
                                            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium cursor-pointer transition-colors">
                                                <IconUpload className="size-3.5 text-accent" />
                                                <span>{watch("resume") ? "Change PDF" : user?.resumeUrl ? "Replace Resume (PDF)" : "Upload Resume (PDF)"}</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setValue("resume", file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            {watch("resume") && (
                                                <button
                                                    type="button"
                                                    onClick={() => setValue("resume", undefined)}
                                                    className="text-xs text-muted-foreground hover:text-destructive transition-colors inline-flex items-center gap-1"
                                                >
                                                    <IconX className="size-3.5" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <FieldDescription>
                                        Visitors will be able to download or view this PDF from the &quot;Resume&quot; button in your Hero section.
                                    </FieldDescription>
                                </Field>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="user-name">
                                        Name *
                                    </FieldLabel>
                                    <Input
                                        id="user-name"
                                        placeholder="John Doe"
                                        aria-invalid={!!errors.name}
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <FieldError>
                                            {errors.name.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="user-email">
                                        Email *
                                    </FieldLabel>
                                    <Input
                                        id="user-email"
                                        type="email"
                                        placeholder="john@example.com"
                                        aria-invalid={!!errors.email}
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <FieldError>
                                            {errors.email.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="user-title">
                                        Title
                                    </FieldLabel>
                                    <Input
                                        id="user-title"
                                        placeholder="Full Stack Developer"
                                        {...register("title")}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="user-phone">
                                        Phone
                                    </FieldLabel>
                                    <Input
                                        id="user-phone"
                                        placeholder="+1 (555) 000-0000"
                                        {...register("phone")}
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="user-address">
                                    Address
                                </FieldLabel>
                                <Input
                                    id="user-address"
                                    placeholder="123 Main St, City, State"
                                    {...register("address")}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>About</FieldLabel>
                                <RichTextEditor
                                    value={watch("about") ?? ""}
                                    onChange={(val) => setValue("about", val)}
                                    placeholder="Tell us about yourself..."
                                />
                                <FieldDescription>
                                    Use the toolbar to format text with
                                    headings, lists, and more.
                                </FieldDescription>
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
                            Save Profile
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
