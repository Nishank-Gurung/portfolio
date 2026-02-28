"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import APIRequest from "@/lib/BackendReq";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";
import { socialMedia } from "@/lib/types";
import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import PageSkeleton from "../skeleton/PageSkeleton";

export default function SocialsPage({ error }: { error?: string }) {
    const { data: socialsData, isLoading } = useQueryGetSocials();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSocialId, setSelectedSocialId] = useState<number | null>(
        null,
    );
    const queryClient = useQueryClient();
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

    if (isLoading || !socialsData?.data?.social) {
       return <PageSkeleton/>;
    }

    const socials: socialMedia[] = socialsData.data.social || [];

    const handleEdit = (social: socialMedia) => {
        router.push(`/admin/editor/social?id=${social.id}`);
    };

    const handleDelete = (social: socialMedia) => {
        setSelectedSocialId(social.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            startTransition(async () => {
                const res = await APIRequest.delete(
                    `/api/social/${selectedSocialId}`,
                );
                if (!res.data.success) {
                    showErrorTost("Failed to delete social media entry");
                }
                showSuccessToast(res.data.message);
                setDeleteModalOpen(false);
                setSelectedSocialId(null);
                queryClient.invalidateQueries({ queryKey: ["socials"] });
            });
        } catch (error) {
            showErrorTost("Failed to delete social media entry");
            showErrorTost((error as Error).message);
            console.log(error);
        }
    };
    return (
        <div className="container mx-auto ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Socials Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Socials: {socials.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/social">Add Social</Link>
                </Button>
            </div>
            <div>
                {socials.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No social media entries found. Click Add Social to
                        create one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Social Platform</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {socials.map((social) => (
                                    <TableRow key={social.id}>
                                        <TableCell>{social.platform}</TableCell>
                                        <TableCell>
                                            {social.image ? (
                                                <Image
                                                    src={social.image}
                                                    alt={social.platform}
                                                    width={28}
                                                    height={28}
                                                    className="size-7 object-contain"
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {social.platform}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{social.order}</TableCell>

                                        <TableCell className="w-[100px]">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <IconDots className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(social)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(social)
                                                        }
                                                    >
                                                        <IconTrash className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <DeleteModal
                isPending={isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
