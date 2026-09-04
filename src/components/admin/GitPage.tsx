"use client";

import React, { useMemo, useState } from "react";
import { format, addMinutes, subDays, setHours, setMinutes, setSeconds } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    IconCheck,
    IconCopy,
    IconGitCommit,
    IconClock,
    IconCalendar,
    IconSparkles,
    IconTerminal2,
    IconRefresh,
    IconTimeline,
    IconClockPlay,
} from "@tabler/icons-react";

interface CommitOption {
    id: number;
    offsetMinutes: number;
    offsetLabel: string;
    dateTime: Date;
    formattedDate: string;
    formattedTime: string;
    humanTime: string;
    humanDate: string;
    fullIsoString: string;
    command: string;
}

const COMMON_TIMEZONES = [
    { label: "NPT (+05:45)", value: "+05:45" },
    { label: "IST (+05:30)", value: "+05:30" },
    { label: "UTC (+00:00)", value: "+00:00" },
    { label: "EST (-05:00)", value: "-05:00" },
    { label: "PST (-08:00)", value: "-08:00" },
];

const TIME_PRESETS = [
    { label: "Now", getTime: () => format(new Date(), "HH:mm") },
    { label: "09:00 AM", getTime: () => "09:00" },
    { label: "12:00 PM", getTime: () => "12:00" },
    { label: "03:30 PM", getTime: () => "15:30" },
    { label: "06:00 PM", getTime: () => "18:00" },
    { label: "09:00 PM", getTime: () => "21:00" },
];

const INTERVAL_PRESETS = [5, 10, 15, 30, 60];

export default function GitPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timeValue, setTimeValue] = useState<string>(() => format(new Date(), "HH:mm"));
    const [timezone, setTimezone] = useState<string>("+05:45");
    const [commitMessage, setCommitMessage] = useState<string>("feat: updates");
    const [intervalMinutes, setIntervalMinutes] = useState<number>(10);
    const [optionCount, setOptionCount] = useState<number>(5);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState<boolean>(false);

    // Parse base datetime
    const baseDateTime = useMemo(() => {
        const [hoursStr, minutesStr] = (timeValue || "12:00").split(":");
        const hours = parseInt(hoursStr, 10) || 0;
        const minutes = parseInt(minutesStr, 10) || 0;
        const dt = selectedDate ? new Date(selectedDate) : new Date();
        return setSeconds(setMinutes(setHours(dt, hours), minutes), 0);
    }, [selectedDate, timeValue]);

    // Generate multiple options (default 5, 10-minute intervals)
    const commitOptions: CommitOption[] = useMemo(() => {
        const options: CommitOption[] = [];
        const msg = commitMessage.trim();
        const msgFlag = msg.length > 0 ? ` -m "${msg}"` : " -m";

        for (let i = 0; i < optionCount; i++) {
            const offset = i * intervalMinutes;
            const optionTime = addMinutes(baseDateTime, offset);
            const datePart = format(optionTime, "yyyy-MM-dd");
            const timePart = format(optionTime, "HH:mm:ss");
            const fullIso = `${datePart}T${timePart}${timezone}`;
            const cmd = `GIT_COMMITTER_DATE="${fullIso}" git commit --date="${fullIso}"${msgFlag}`;

            options.push({
                id: i,
                offsetMinutes: offset,
                offsetLabel: i === 0 ? "Base Time" : `+${offset} mins`,
                dateTime: optionTime,
                formattedDate: datePart,
                formattedTime: timePart,
                humanTime: format(optionTime, "hh:mm:ss a"),
                humanDate: format(optionTime, "EEE, MMM d, yyyy"),
                fullIsoString: fullIso,
                command: cmd,
            });
        }
        return options;
    }, [baseDateTime, intervalMinutes, optionCount, timezone, commitMessage]);

    // Copy single command
    const handleCopyOption = async (option: CommitOption) => {
        try {
            await navigator.clipboard.writeText(option.command);
            setCopiedIndex(option.id);
            toast.success(`Copied command for ${option.offsetLabel} (${option.humanTime})`);
            setTimeout(() => {
                setCopiedIndex((prev) => (prev === option.id ? null : prev));
            }, 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy to clipboard");
        }
    };

    // Copy all options chained
    const handleCopyAll = async () => {
        try {
            const chained = commitOptions.map((opt) => opt.command).join(" && \\\n");
            await navigator.clipboard.writeText(chained);
            setCopiedAll(true);
            toast.success(`Copied all ${commitOptions.length} commands as a sequence!`);
            setTimeout(() => setCopiedAll(false), 2500);
        } catch (err) {
            console.error("Failed to copy all:", err);
            toast.error("Failed to copy sequence");
        }
    };

    // Stepper helpers
    const adjustTime = (minutesDelta: number) => {
        const newTime = addMinutes(baseDateTime, minutesDelta);
        setTimeValue(format(newTime, "HH:mm"));
        setSelectedDate(newTime);
    };

    // Quick date presets
    const handleQuickDate = (daysAgo: number) => {
        if (daysAgo === 0) {
            setSelectedDate(new Date());
        } else {
            setSelectedDate(subDays(new Date(), daysAgo));
        }
    };

    // Set an option as the new base
    const handleSetAsBase = (option: CommitOption) => {
        setSelectedDate(option.dateTime);
        setTimeValue(format(option.dateTime, "HH:mm"));
        toast.info(`Updated base time to ${format(option.dateTime, "hh:mm a")}`);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconGitCommit className="size-6" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Git Commit Timestamp Generator
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Select a target date and time to generate accurate backdated or staggered Git commit commands.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            setSelectedDate(new Date());
                            setTimeValue(format(new Date(), "HH:mm"));
                            toast.info("Reset to current date & time");
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                    >
                        <IconRefresh className="size-3.5 mr-1" />
                        Reset to Now
                    </Button>
                    <Button
                        onClick={handleCopyAll}
                        variant="default"
                        size="sm"
                        className="text-xs font-medium shadow-xs"
                    >
                        {copiedAll ? (
                            <>
                                <IconCheck className="size-3.5 mr-1 text-emerald-300" />
                                Copied All!
                            </>
                        ) : (
                            <>
                                <IconTerminal2 className="size-3.5 mr-1" />
                                Copy All {commitOptions.length} Commands
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Grid: Left Controls, Right Generated Multi-Options */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Panel: Date & Time Picker Controls (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Date Picker Card */}
                    <Card className="shadow-xs border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <IconCalendar className="size-4 text-primary" />
                                    Select Date
                                </CardTitle>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {format(selectedDate, "yyyy-MM-dd")}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs">
                                Pick a day or click a quick preset below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date Quick Chips */}
                            <div className="flex flex-wrap gap-1.5">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => handleQuickDate(0)}
                                    className="text-xs"
                                >
                                    Today
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => handleQuickDate(1)}
                                    className="text-xs"
                                >
                                    Yesterday
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => handleQuickDate(2)}
                                    className="text-xs"
                                >
                                    2 Days Ago
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => handleQuickDate(7)}
                                    className="text-xs"
                                >
                                    1 Week Ago
                                </Button>
                            </div>

                            {/* Calendar */}
                            <div className="flex justify-center border rounded-lg p-2 bg-muted/20">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(d) => d && setSelectedDate(d)}
                                    captionLayout="dropdown"
                                    className="rounded-md"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time Picker & Settings Card */}
                    <Card className="shadow-xs border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <IconClock className="size-4 text-primary" />
                                    Select Base Time
                                </CardTitle>
                                <Badge variant="outline" className="font-mono text-xs">
                                    {format(baseDateTime, "hh:mm a")}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs">
                                Set hour, minutes, and time intervals.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Native Time Input & Steppers */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground block">
                                    Base Time (24h or native picker)
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="time"
                                        value={timeValue}
                                        onChange={(e) => setTimeValue(e.target.value || "12:00")}
                                        className="font-mono text-base h-10 w-full"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setTimeValue(format(new Date(), "HH:mm"))}
                                        className="shrink-0 text-xs"
                                        title="Current Time"
                                    >
                                        <IconClockPlay className="size-4 mr-1" />
                                        Now
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Time Presets */}
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Quick Time Presets:
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {TIME_PRESETS.map((preset) => (
                                        <Button
                                            key={preset.label}
                                            variant="outline"
                                            size="xs"
                                            onClick={() => setTimeValue(preset.getTime())}
                                            className="text-xs font-mono justify-center"
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Fine Adjustment Steppers */}
                            <div className="space-y-1.5 pt-1 border-t">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Fine Adjustments:
                                </span>
                                <div className="grid grid-cols-4 gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => adjustTime(-60)}
                                        className="text-xs"
                                    >
                                        -1 hr
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => adjustTime(60)}
                                        className="text-xs"
                                    >
                                        +1 hr
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => adjustTime(-10)}
                                        className="text-xs"
                                    >
                                        -10 min
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => adjustTime(10)}
                                        className="text-xs"
                                    >
                                        +10 min
                                    </Button>
                                </div>
                            </div>

                            {/* Interval & Options Count Configuration */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                                        Interval
                                    </label>
                                    <div className="flex gap-1 flex-wrap">
                                        {INTERVAL_PRESETS.map((int) => (
                                            <Button
                                                key={int}
                                                type="button"
                                                variant={intervalMinutes === int ? "default" : "outline"}
                                                size="xs"
                                                onClick={() => setIntervalMinutes(int)}
                                                className="text-xs px-2"
                                            >
                                                {int}m
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                                        Number of Options
                                    </label>
                                    <div className="flex gap-1">
                                        {[3, 5, 8, 10].map((cnt) => (
                                            <Button
                                                key={cnt}
                                                type="button"
                                                variant={optionCount === cnt ? "default" : "outline"}
                                                size="xs"
                                                onClick={() => setOptionCount(cnt)}
                                                className="text-xs px-2"
                                            >
                                                {cnt}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Timezone & Commit Message */}
                            <div className="space-y-3 pt-2 border-t">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Timezone Offset
                                        </label>
                                        <div className="flex gap-1">
                                            {COMMON_TIMEZONES.map((tz) => (
                                                <button
                                                    key={tz.value}
                                                    type="button"
                                                    onClick={() => setTimezone(tz.value)}
                                                    className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                                                        timezone === tz.value
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                                                    }`}
                                                >
                                                    {tz.label.split(" ")[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Input
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        placeholder="+05:45"
                                        className="font-mono text-xs h-8"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground block">
                                        Commit Message (-m)
                                    </label>
                                    <Input
                                        value={commitMessage}
                                        onChange={(e) => setCommitMessage(e.target.value)}
                                        placeholder="feat: updates"
                                        className="text-xs h-8"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: 5 Generated Interval Options (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    {/* Header info badge */}
                    <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <IconTimeline className="size-4 text-primary" />
                            <span className="text-xs font-medium">
                                Showing <strong>{commitOptions.length} Options</strong> at{" "}
                                <strong>{intervalMinutes}-minute</strong> intervals
                            </span>
                        </div>
                        <Badge variant="outline" className="text-[11px] font-mono">
                            Base: {format(baseDateTime, "hh:mm a")} ({timezone})
                        </Badge>
                    </div>

                    {/* List of Options */}
                    <div className="space-y-3">
                        {commitOptions.map((option, index) => {
                            const isBase = index === 0;
                            const isCopied = copiedIndex === option.id;

                            return (
                                <Card
                                    key={option.id}
                                    className={`transition-all duration-200 border relative overflow-hidden ${
                                        isBase
                                            ? "border-primary/50 shadow-sm bg-gradient-to-r from-primary/5 to-transparent"
                                            : "hover:border-primary/30"
                                    }`}
                                >
                                    {isBase && (
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
                                    )}

                                    <CardContent className="p-4 space-y-3">
                                        {/* Card Top Row: Badge, Time, and Actions */}
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={isBase ? "default" : "secondary"}
                                                    className="text-xs font-medium gap-1 py-0.5"
                                                >
                                                    {isBase && <IconSparkles className="size-3" />}
                                                    {`Option ${index + 1}`} • {option.offsetLabel}
                                                </Badge>

                                                <span className="text-sm font-semibold tracking-tight">
                                                    {option.humanTime}
                                                </span>

                                                <span className="text-xs text-muted-foreground hidden sm:inline">
                                                    • {option.humanDate}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 ml-auto">
                                                {!isBase && (
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => handleSetAsBase(option)}
                                                        className="text-[11px] h-7 text-muted-foreground hover:text-foreground"
                                                        title="Make this the starting base time"
                                                    >
                                                        Set as Base
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleCopyOption(option)}
                                                    variant={isCopied ? "default" : "outline"}
                                                    size="sm"
                                                    className={`h-7 px-2.5 text-xs font-medium transition-all ${
                                                        isCopied ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                                                    }`}
                                                >
                                                    {isCopied ? (
                                                        <>
                                                            <IconCheck className="size-3.5 mr-1" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IconCopy className="size-3.5 mr-1" />
                                                            Copy Command
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Command Terminal Preview */}
                                        <div className="relative group">
                                            <div className="bg-zinc-950 dark:bg-black/80 text-zinc-100 rounded-md p-2.5 font-mono text-xs border border-zinc-800 flex items-center justify-between gap-2 overflow-x-auto shadow-inner">
                                                <div className="truncate selection:bg-primary/30">
                                                    <span className="text-zinc-500 select-none mr-2">$</span>
                                                    <span className="text-amber-400">GIT_COMMITTER_DATE</span>
                                                    <span className="text-zinc-400">=</span>
                                                    <span className="text-emerald-300">{`"${option.fullIsoString}"`}</span>
                                                    {" "}
                                                    <span className="text-blue-400">git commit</span>
                                                    {" "}
                                                    <span className="text-zinc-400">--date=</span>
                                                    <span className="text-emerald-300">{`"${option.fullIsoString}"`}</span>
                                                    {commitMessage.trim() ? (
                                                        <>
                                                            {" "}
                                                            <span className="text-zinc-400">-m</span>{" "}
                                                            <span className="text-orange-300">{`"${commitMessage.trim()}"`}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-zinc-400">{' -m ""'}</span>
                                                    )}
                                                </div>

                                                <Button
                                                    size="icon-xs"
                                                    variant="ghost"
                                                    onClick={() => handleCopyOption(option)}
                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                                                    title="Copy command"
                                                >
                                                    {isCopied ? (
                                                        <IconCheck className="size-3 text-emerald-400" />
                                                    ) : (
                                                        <IconCopy className="size-3" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Batch Execution Info Box */}
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xs font-semibold flex items-center gap-1.5">
                                    <IconTerminal2 className="size-3.5 text-primary" />
                                    Sequential Batch Execution
                                </h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Need to commit multiple files sequentially? Click below to copy all {commitOptions.length} commands joined by <code className="bg-muted px-1 py-0.5 rounded font-mono">&&</code>.
                                </p>
                            </div>
                            <Button
                                onClick={handleCopyAll}
                                variant="outline"
                                size="sm"
                                className="shrink-0 text-xs"
                            >
                                {copiedAll ? (
                                    <>
                                        <IconCheck className="size-3.5 mr-1 text-emerald-500" />
                                        Batch Copied!
                                    </>
                                ) : (
                                    <>
                                        <IconCopy className="size-3.5 mr-1" />
                                        Copy Sequence
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
