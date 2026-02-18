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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { user } from "@/lib/types";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import APIRequest from "@/lib/BackendReq";
import { showErrorTost, showSuccessToast } from "@/lib/utils";

export function UserForm({ user }: { user?: user }) {
    const [isPending, startTransition] = useTransition();
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
        console.log(data)
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("email", data.email);
                if (data.title) formData.append("title", data.title);
                if (data.about) formData.append("about", data.about);
                if (data.phone) formData.append("phone", data.phone);
                if (data.address) formData.append("address", data.address);
                if (data.password) formData.append("password", data.password);
                if (data.image) formData.append("image", data.image);
                const response = await APIRequest.post("api/user", formData);
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push("/admin/user");
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
                            <Field>
                                <FieldLabel>Profile Image</FieldLabel>
                                <ImageUpload
                                    value={watch("image") as File | undefined}
                                    onChange={(file) => setValue("image", file)}
                                    previewUrl={user?.image ? user.image : null}
                                />
                            </Field>
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
