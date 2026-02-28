'use client'
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>{children}</TooltipProvider>
                <ReactQueryDevtools position="bottom" initialIsOpen={true} />
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default Providers;
