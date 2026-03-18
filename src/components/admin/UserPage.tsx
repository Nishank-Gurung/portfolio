"use client";

import { useEffect } from "react";
import { showErrorTost } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { HeroSection } from "../sections/hero";
export default function UserPage({ error }: { error?: string }) {
    useEffect(() => {
        if (error) {
            showErrorTost(error);
            window.history.replaceState(
                null,
                "",
                `?${new URLSearchParams().toString()}`,
            );
        }
    }, [error]);
    return (
        // <div><UserContent /></div>
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Page</h1>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/user">Update User</Link>
                </Button>
            </div>
            <div>
                <HeroSection/>
            </div>
        </div>
    );
}

// const UserCard = async ({ user }: { user: user }) => {
//     return (
//         <div>
//             <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
//                 <Avatar className="mb-8 size-28 ring-2 ring-border ring-offset-4 ring-offset-background">
//                     <AvatarImage src={user.image} alt={user.name} />
//                     <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
//                         {user.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                     </AvatarFallback>
//                 </Avatar>

//                 <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
//                     {user.title}
//                 </p>

//                 <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
//                     {"Hi, I'm "}
//                     <span className="text-gradient">{user.name}</span>
//                 </h1>

//                 <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
//                     {/* {shortAbout} */}
//                 </p>

//                 <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
//                     <Button asChild>
//                         <a href="#contact">
//                             <IconMail className="size-4" />
//                             Get in touch
//                         </a>
//                     </Button>
//                     <Button variant="outline" asChild>
//                         <a href="#projects">
//                             <IconFileText className="size-4" />
//                             View work
//                         </a>
//                     </Button>
//                 </div>

//                 <TooltipProvider delayDuration={0}>
//                     <div className="flex items-center gap-4">
//                         {socialLinks.map((social) => (
//                             <SocialIcon key={social.id} social={social} />
//                         ))}
//                     </div>
//                 </TooltipProvider>
//             </div>
//         </div>
//     );
// };
