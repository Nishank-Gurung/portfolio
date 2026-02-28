"use client";

import { Resolver, useForm } from "react-hook-form";
import { socialMediaSchema, type socialMediaSchemaType } from "@/lib/schemas";
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
import { ImageUpload } from "@/components/image-upload";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialMedia } from "@/lib/types";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import APIRequest from "@/lib/BackendReq";

export function SocialMediaForm({
    socialMedia,
}: {
    socialMedia?: socialMedia;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<socialMediaSchemaType>({
        resolver: zodResolver(socialMediaSchema) as Resolver<socialMediaSchemaType>,
        defaultValues: {
            platform: socialMedia?.platform ?? "",
            url: socialMedia?.url ?? "",
            order: socialMedia?.order ?? 0,
            image: undefined,
        },
    });

    function onSubmit(data: socialMediaSchemaType) {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("platform", data.platform);
                formData.append("url", data.url);
                formData.append("order", data.order.toString());
                if (data.image) formData.append("image", data.image);
                const response = await APIRequest.post(
                    socialMedia
                        ? `api/social/${socialMedia.id}`
                        : "api/social",
                    formData,
                );
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push("/admin/socials");
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
                <CardTitle className="text-foreground">Social Media</CardTitle>
                <CardDescription>
                    {socialMedia?.id
                        ? `Edit social media link #${socialMedia.platform}`
                        : "Add a social media link to your profile."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Social Link Details</FieldLegend>
                        <FieldGroup>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field data-invalid={!!errors.platform}>
                                    <FieldLabel htmlFor="social-platform">
                                        Platform *
                                    </FieldLabel>
                                    <Input
                                        id="social-platform"
                                        placeholder="GitHub"
                                        aria-invalid={!!errors.platform}
                                        {...register("platform")}
                                    />
                                    {errors.platform && (
                                        <FieldError>
                                            {errors.platform.message}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.order}>
                                    <FieldLabel htmlFor="social-order">
                                        Display Order *
                                    </FieldLabel>
                                    <Input
                                        id="social-order"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        aria-invalid={!!errors.order}
                                        {...register("order", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.order && (
                                        <FieldError>
                                            {errors.order.message}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field data-invalid={!!errors.url}>
                                <FieldLabel htmlFor="social-url">
                                    URL *
                                </FieldLabel>
                                <Input
                                    id="social-url"
                                    placeholder="https://github.com/username"
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
                                <FieldLabel>Platform Icon</FieldLabel>
                                <ImageUpload
                                    value={watch("image") as File | undefined}
                                    onChange={(file) => setValue("image", file)}
                                    previewUrl={
                                        socialMedia?.image
                                            ? socialMedia.image
                                            : null
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
                            Save Social Media
                        </LoadingButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
