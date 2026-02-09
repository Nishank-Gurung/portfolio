import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
