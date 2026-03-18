import {
    createBlog,
    deleteBlog,
    updateBlog,
} from "@/actions/blog/blog-crud";
import { postSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateBlogProps {
    id: number;
    blogData: postSchemaType;
}

export const useBlogMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createBlogMutation = useMutation({
        mutationKey: ["blog"],
        mutationFn: async (params: postSchemaType) => {
            const result = await createBlog(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateBlogMutation = useMutation({
        mutationKey: ["blog"],
        mutationFn: async (params: UpdateBlogProps) => {
            const result = await updateBlog(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({
                queryKey: ["single-blog", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteBlogMutation = useMutation({
        mutationKey: ["blog"],
        mutationFn: async (blogId: number) => {
            const result = await deleteBlog(blogId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        createBlogMutation,
        updateBlogMutation,
        deleteBlogMutation,
    };
};
