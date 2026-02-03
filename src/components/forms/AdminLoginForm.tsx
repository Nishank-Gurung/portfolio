'use client'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"

export default function AdminLoginForm() {
     
    const formSchema = z.object({
        email: z.email(),
        password: z.string().min(6),
    })

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
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
                            <Input type="email" {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Enter your email"/>
                            {errors.email && <FieldError>{errors.email.message}</FieldError>}
                        </Field>
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <Input type="password" {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Enter your password"/>
                            {errors.password && <FieldError>{errors.password.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
        </form>
    </div>
  )
}
