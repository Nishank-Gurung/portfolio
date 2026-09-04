import { cn } from "@/lib/utils";

interface HtmlContentProps {
    html?: string | null;
    className?: string;
}

export function HtmlContent({ html, className }: HtmlContentProps) {
    if (!html) return null;

    return (
        <div
            className={cn(
                "html-content max-w-none text-muted-foreground leading-relaxed",
                className
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
