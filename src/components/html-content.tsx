import { cn } from "@/lib/utils";

interface HtmlContentProps {
    html: string;
    className?: string;
}

export function HtmlContent({ html, className }: HtmlContentProps) {
    return (
        <div
            className={cn(
                "prose prose-sm max-w-none dark:prose-invert",
                "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
                "prose-p:text-muted-foreground prose-p:leading-relaxed",
                "prose-a:text-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-accent/80",
                "prose-strong:text-foreground prose-strong:font-semibold",
                "prose-code:rounded prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-foreground",
                "prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-secondary",
                "prose-ul:text-muted-foreground prose-ol:text-muted-foreground",
                "prose-li:marker:text-accent",
                "prose-blockquote:border-accent prose-blockquote:text-muted-foreground",
                "prose-img:rounded-lg",
                "prose-hr:border-border",
                "prose-li:p-0 prose-li:m-0",
                "prose-ul:list-disc prose-ul:pl-6 prose-ul:marker:text-accent",
                "prose-ol:list-decimal prose-ol:pl-6",
                "prose-li:my-1",
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
