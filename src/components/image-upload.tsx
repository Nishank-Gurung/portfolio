"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconUpload, IconX } from "@tabler/icons-react";

interface ImageUploadProps {
    value?: File | null;
    onChange: (file: File | undefined) => void;
    previewUrl: string | null;
}

export function ImageUpload({ value, onChange, previewUrl }: ImageUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(previewUrl);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (value) {
            const url = URL.createObjectURL(value);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        if (!value && previewUrl) {
            setPreview(previewUrl);
        } else if (!value && !previewUrl) {
            setPreview(null);
        }
    }, [value, previewUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = () => {
        onChange(undefined);
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted",
                )}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <IconUpload className="h-6 w-6 text-muted-foreground" />
                )}
            </button>
            {preview && (
                <button
                    type="button"
                    onClick={handleRemove}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Remove image"
                >
                    <IconX className="h-4 w-4" />
                </button>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
            />
        </div>
    );
}
