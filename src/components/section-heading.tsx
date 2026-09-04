"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
    title: string;
    description?: string;
    badge?: string;
    align?: "left" | "center";
}

export function SectionHeading({
    title,
    description,
    badge,
    align = "left",
}: SectionHeadingProps) {
    const isCenter = align === "center";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`mb-12 flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"}`}
        >
            {badge && (
                <div className="mb-2.5">
                    <Badge
                        variant="secondary"
                        className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 text-accent border border-accent/20 bg-accent/10"
                    >
                        {badge}
                    </Badge>
                </div>
            )}

            <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
            </div>

            {description && (
                <p className="mt-2.5 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {description}
                </p>
            )}

            <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-accent to-accent/20" />
        </motion.div>
    );
}
