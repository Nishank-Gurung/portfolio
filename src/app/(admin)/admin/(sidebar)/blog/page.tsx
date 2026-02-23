import BlogPage from "@/components/admin/BlogPage";
import React from "react";

interface Props {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}
export default async function page({ searchParams }: Props) {
    const error = searchParams.error as string | undefined;
    return (
        <div>
            <BlogPage error={error} />
        </div>
    );
}
