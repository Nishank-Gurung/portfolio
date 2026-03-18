"use client";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import LoadingButton from "../ui/loading-button";
import { PasswordInput } from "../ui/input-password";
import { useAuthMutation } from "@/hooks/mutation-hooks/auth-mutation";
import { useRouter } from "next/navigation";
import { ADMIN_DEFAULT_REDIRECT_URL } from "@/config/constant";

export default function AdminLoginForm() {
    const { loginMutation } = useAuthMutation();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: loginSchemaType) {
        loginMutation.mutate(data);
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
                        loading={loginMutation.isPending}
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
