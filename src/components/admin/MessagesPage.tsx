"use client";

import { useState, useTransition } from "react";
import { Message } from "@/generated/prisma/client";
import { markMessageAsRead, deleteMessage } from "@/actions/message/message-crud";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    IconClock,
    IconInbox,
    IconMail,
    IconMailOpened,
    IconSearch,
    IconTrash,
    IconUser,
    IconX,
} from "@tabler/icons-react";

export function MessagesPage({ initialMessages }: { initialMessages: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [searchQuery, setSearchQuery] = useState("");
    const [, startTransition] = useTransition();

    const filteredMessages = messages.filter((msg) => {
        const query = searchQuery.toLowerCase();
        return (
            msg.name.toLowerCase().includes(query) ||
            msg.email.toLowerCase().includes(query) ||
            (msg.subject && msg.subject.toLowerCase().includes(query)) ||
            msg.message.toLowerCase().includes(query)
        );
    });

    const unreadCount = messages.filter((m) => !m.isRead).length;

    const handleToggleRead = (id: number, currentStatus: boolean) => {
        startTransition(async () => {
            const nextStatus = !currentStatus;
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isRead: nextStatus } : m))
            );

            const res = await markMessageAsRead(id, nextStatus);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
                // Rollback
                setMessages((prev) =>
                    prev.map((m) => (m.id === id ? { ...m, isRead: currentStatus } : m))
                );
            }
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        startTransition(async () => {
            setMessages((prev) => prev.filter((m) => m.id !== id));

            const res = await deleteMessage(id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconInbox className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Inquiries & Messages
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Review and reply to direct messages sent by recruiters, clients, and visitors from your portfolio.
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="shadow-xs border-border/70">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total Inquiries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {messages.length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-border/70">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Unread Messages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold tracking-tight text-accent">
                                {unreadCount}
                            </div>
                            {unreadCount > 0 && (
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-border/70 col-span-2 sm:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Read Messages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-muted-foreground">
                            {messages.length - unreadCount}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search filter */}
            <div className="relative">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Search by sender name, email, subject, or message keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-9 h-10 bg-card/60 text-sm border-border/70 focus-visible:ring-accent"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <IconX className="size-4" />
                    </button>
                )}
            </div>

            {/* Message List */}
            {filteredMessages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20">
                    <div className="size-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                        <IconInbox className="size-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                        {searchQuery ? "No matching messages found" : "No messages yet"}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                        {searchQuery
                            ? "Try searching for a different name, email, or keyword."
                            : "When visitors or recruiters submit the Quick Message form on your portfolio, their messages will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`rounded-2xl border transition-all p-5 ${
                                !msg.isRead
                                    ? "border-accent/40 bg-accent/5 shadow-xs"
                                    : "border-border/70 bg-card/40 hover:border-border"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                                        <IconUser className="size-4 text-accent" />
                                        <span>{msg.name}</span>
                                    </div>

                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="text-xs text-muted-foreground hover:text-accent transition-colors underline underline-offset-2"
                                    >
                                        {msg.email}
                                    </a>

                                    {!msg.isRead ? (
                                        <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px] px-2 py-0">
                                            New
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] px-2 py-0 text-muted-foreground">
                                            Read
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <IconClock className="size-3.5 text-muted-foreground/70" />
                                        <span>{formatDate(msg.createdAt)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleToggleRead(msg.id, msg.isRead)}
                                            className="h-8 px-2 text-xs"
                                            title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                        >
                                            {msg.isRead ? (
                                                <IconMail className="size-3.5" />
                                            ) : (
                                                <IconMailOpened className="size-3.5 text-accent" />
                                            )}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                            className="h-8 px-2.5 text-xs font-medium"
                                        >
                                            <a
                                                href={`mailto:${msg.email}?subject=${encodeURIComponent(
                                                    `Re: ${msg.subject || "Your inquiry via portfolio"}`
                                                )}`}
                                            >
                                                Reply
                                            </a>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(msg.id)}
                                            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                            title="Delete message"
                                        >
                                            <IconTrash className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Subject */}
                            {msg.subject && (
                                <div className="text-xs font-semibold text-foreground mb-1.5">
                                    Subject: <span className="font-normal text-foreground/90">{msg.subject}</span>
                                </div>
                            )}

                            {/* Message Body */}
                            <div className="text-xs text-foreground/80 leading-relaxed bg-background/50 rounded-xl p-3 border border-border/50 whitespace-pre-wrap">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
