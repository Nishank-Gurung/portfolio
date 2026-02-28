"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconCheck, IconCopy } from "@tabler/icons-react";


export default function GitPage() {
    const [value, setValue] = useState("11:00");
    const [copied, setCopied] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>("2026-02-16T10:00:00.000Z");
    const [formattedDate, setFormattedDate] = useState<string>("");
    useEffect(()=>{
        //trim the selectedDate to only show the date part

            // setSelectedDate(selectedDate.split("T")[0]);
        const date = selectedDate?.split("T")[0]

        //value is supposed to be number so if 1040 is given make it 10:40 and if 10 or 1000 is given make it 10:00
        const time = value.length === 4 ? `${value.slice(0, 2)}:${value.slice(2)}` : value;
        
        // const formatted = `${date}T${time}:00+05:45`;
        const formattesd = `GIT_COMMITTER_DATE="${date}T${time}:00+05:45" git commit --date="${date}T${time}:00+05:45" -m`
        setFormattedDate(formattesd);
    },[selectedDate,value,setFormattedDate])


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formattedDate);
            setCopied(true);


            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };


    return (
        <Card>
            <CardContent className="flex justify-center items-center gap-3">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    className="rounded-lg border"
                    onSelect={(date) => {setSelectedDate(date?.toISOString()) 
                        console.log((date)?.toISOString())}}
                />
                <div>
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Select time"
                    />
                </div>
            </CardContent>
                <div className="flex w-full items-center space-x-2 px-3">
                    <Input className="w-full" value={ formattedDate} readOnly />
                    <Button onClick={handleCopy} variant="outline" size="icon">
                        {copied ? (
                            <IconCheck className="h-4 w-4" />
                        ) : (
                            <IconCopy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
        </Card>
    );
}
