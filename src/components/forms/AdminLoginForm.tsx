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
import { Input } from "../ui/input"

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
                            <FieldDescription>Enter your email address.</FieldDescription>
                            <Input type="email" {...field} id={field.name} aria-invalid={fieldState.invalid}/>
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
                            <FieldDescription>Enter your password.</FieldDescription>
                            <Input type="password" {...field} id={field.name} aria-invalid={fieldState.invalid} />
                            {errors.password && <FieldError>{errors.password.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
        </form>
    </div>
  )
}
