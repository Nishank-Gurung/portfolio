"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!mounted) {
        return (
            <div className="size-8 rounded-full flex items-center justify-center text-muted-foreground" />
        );
    }

    const isDark = resolvedTheme === "dark" || theme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="relative size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors focus:outline-hidden"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center text-amber-400"
                    >
                        <IconSun className="size-4" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center text-accent"
                    >
                        <IconMoon className="size-4" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
