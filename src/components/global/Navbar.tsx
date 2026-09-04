"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    IconArrowUpRight,
    IconBriefcase,
    IconCode,
    IconFolder,
    IconHome,
    IconMail,
    IconSchool,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
    { label: "Home", href: "#hero", icon: IconHome },
    { label: "Experience", href: "#experience", icon: IconBriefcase },
    { label: "Projects", href: "#projects", icon: IconFolder },
    { label: "Stack", href: "#skills", icon: IconCode },
    { label: "Education", href: "#education", icon: IconSchool },
    { label: "Contact", href: "#contact", icon: IconMail },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState<string>("hero");
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            setScrolled(scrollPos > 40);

            // Determine active section
            const sections = NAV_ITEMS.map((item) => item.href.substring(1));
            for (const section of [...sections].reverse()) {
                const el = document.getElementById(section);
                if (el) {
                    const top = el.offsetTop - 160;
                    if (scrollPos >= top) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full border transition-all duration-300 ${
                    scrolled
                        ? "bg-background/85 dark:bg-card/85 backdrop-blur-xl border-border/80 shadow-xl shadow-black/10"
                        : "bg-background/60 dark:bg-card/60 backdrop-blur-md border-border/50 shadow-md"
                }`}
            >
                {NAV_ITEMS.map((item) => {
                    const sectionId = item.href.substring(1);
                    const isActive = activeSection === sectionId;
                    const Icon = item.icon;

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                isActive
                                    ? "text-white font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            }`}
                            aria-label={item.label}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavDock"
                                    className="absolute inset-0 bg-accent rounded-full shadow-xs"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <Icon className="size-3.5 sm:hidden relative z-10" />
                            <span className="hidden sm:inline relative z-10">{item.label}</span>
                        </a>
                    );
                })}

                <div className="h-4 w-px bg-border/60 mx-0.5 sm:mx-1" />

                {/* Theme Switcher */}
                <ThemeToggle />

                {/* Quick Contact Action */}
                <Button
                    size="sm"
                    variant="ghost"
                    className="hidden sm:flex h-7 px-2.5 text-xs font-medium text-accent hover:text-accent hover:bg-accent/10 rounded-full"
                    asChild
                >
                    <a
                        href="#contact"
                        onClick={(e) => scrollToSection(e, "#contact")}
                    >
                        Let&apos;s Talk
                        <IconArrowUpRight className="size-3 ml-0.5" />
                    </a>
                </Button>
            </motion.nav>
        </header>
    );
}
