"use client";

import { IconArrowUp, IconHeart } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";

export default function Footer() {
    const { data: user } = useQueryGetUser();
    const currentYear = new Date().getFullYear();
    const name = user?.name || "Nishank Gurung";

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t border-border/50 py-10 px-4 sm:px-6 relative bg-card/20">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 text-center sm:text-left">
                    <span>© {currentYear} {name}. Designed & Built with</span>
                    <IconHeart className="size-3.5 text-rose-500 fill-rose-500 inline" />
                    <span>and Next.js.</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] text-muted-foreground/70">
                        Crafted with React & Motion
                    </span>

                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={scrollToTop}
                        className="rounded-full size-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Back to top"
                        aria-label="Back to top"
                    >
                        <IconArrowUp className="size-4" />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
