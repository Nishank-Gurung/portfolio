import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { post } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showErrorTost = (error: any) => {
    if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
    } else if (typeof error === "string") {
        toast.error(error);
    } else {
        toast.error("Something went wrong");
    }
};

export const showSuccessToast = (msg: string) => {
    toast.success(msg);
};

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function extractParagraphsOnly(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const paragraphs = Array.from(tempDiv.querySelectorAll('p'))
  return paragraphs.map((p) => p.outerHTML).join('')
}
export function getReadTime(blog: post): string {
  const stripHtml = (html: string): string =>
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const text = stripHtml(blog.content)
  const words = text.split(' ').length
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)

  return `${minutes} min read`
}
