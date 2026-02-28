"use client";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "../ui/loading-button";
import { useTransition } from "react";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import APIRequest from "@/lib/BackendReq";
import { useRouter } from "next/navigation";
import { ADMIN_DEFAULT_REDIRECT_URL } from "@/config/constant";
import { PasswordInput } from "../ui/input-password";
import { Card } from "../ui/card";

export default function AdminLoginForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const formSchema = z.object({
        email: z.email(),
        password: z.string().min(6),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        startTransition(async () => {
            console.log(data);

            try {
                const formData = new FormData();
                formData.append("email", data.email);
                formData.append("password", data.password);
                const response = await APIRequest.post(
                    "api/auth/login",
                    formData,
                );
                if (response.data.success) {
                    showSuccessToast(response.data.message);
                    router.push(ADMIN_DEFAULT_REDIRECT_URL);
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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    type="email"
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <FieldError>
                                        {errors.email.message}
                                    </FieldError>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <PasswordInput
                                    type="password"
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <FieldError>
                                        {errors.password.message}
                                    </FieldError>
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div>
                    <LoadingButton
                        loading={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Sign In
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
}
