'use client'

import { Button } from "../ui/button";

export default function SocialsPage() {
  return (
        <div className="container mx-auto ">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects Page</h1>
                    <p className="text-muted-foreground mt-1">Total Socials: 0</p>
                </div>
                <Button className="ml-auto">Add Social</Button>
            </div>
            <div>
                    
            </div>
        </div>
    );
}
