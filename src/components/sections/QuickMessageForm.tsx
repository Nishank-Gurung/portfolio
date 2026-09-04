"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, type messageSchemaType } from "@/lib/schemas";
import { submitMessage } from "@/actions/message/message-crud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconCheck, IconLoader2, IconSend } from "@tabler/icons-react";

export function QuickMessageForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<messageSchemaType>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: messageSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await submitMessage(data);
            if (response.success) {
                toast.success(response.message);
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                toast.error(response.message || "Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Something went wrong. Please try again or email directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name Field */}
                <div>
                    <label htmlFor="msg-name" className="block text-xs font-medium text-foreground mb-1.5">
                        Your Name <span className="text-accent">*</span>
                    </label>
                    <Input
                        id="msg-name"
                        placeholder="e.g. Alex Morgan"
                        className="h-10 text-xs bg-background/50 border-border/70 focus-visible:ring-accent"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="msg-email" className="block text-xs font-medium text-foreground mb-1.5">
                        Your Email <span className="text-accent">*</span>
                    </label>
                    <Input
                        id="msg-email"
                        type="email"
                        placeholder="alex@company.com"
                        className="h-10 text-xs bg-background/50 border-border/70 focus-visible:ring-accent"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-[11px] text-destructive mt-1">{errors.email.message}</p>
                    )}
                </div>
            </div>

            {/* Subject Field */}
            <div>
                <label htmlFor="msg-subject" className="block text-xs font-medium text-foreground mb-1.5">
                    Subject / Project Type <span className="text-muted-foreground text-[10px]">(Optional)</span>
                </label>
                <Input
                    id="msg-subject"
                    placeholder="e.g. Full-Stack Web App Collaboration"
                    className="h-10 text-xs bg-background/50 border-border/70 focus-visible:ring-accent"
                    {...register("subject")}
                />
            </div>

            {/* Message Field */}
            <div>
                <label htmlFor="msg-body" className="block text-xs font-medium text-foreground mb-1.5">
                    Message <span className="text-accent">*</span>
                </label>
                <Textarea
                    id="msg-body"
                    placeholder="Tell me about your project, timeline, or idea..."
                    rows={4}
                    className="text-xs bg-background/50 border-border/70 focus-visible:ring-accent resize-none"
                    aria-invalid={!!errors.message}
                    {...register("message")}
                />
                {errors.message && (
                    <p className="text-[11px] text-destructive mt-1">{errors.message.message}</p>
                )}
            </div>

            {/* Submit Action */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 transition-all gap-2"
            >
                {isSubmitting ? (
                    <>
                        <IconLoader2 className="size-4 animate-spin" />
                        Sending Message...
                    </>
                ) : submitted ? (
                    <>
                        <IconCheck className="size-4 text-emerald-300" />
                        Message Sent!
                    </>
                ) : (
                    <>
                        <IconSend className="size-4" />
                        Send Quick Message
                    </>
                )}
            </Button>
        </form>
    );
}
