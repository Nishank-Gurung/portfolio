import {
    createWork,
    deleteWork,
    updateWork,
} from "@/actions/work/work-crud";
import { experienceSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateWorkProps {
    id: number;
    workData: experienceSchemaType;
}

export const useWorkMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createWorkMutation = useMutation({
        mutationKey: ["work"],
        mutationFn: async (params: experienceSchemaType) => {
            const result = await createWork(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["works"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateWorkMutation = useMutation({
        mutationKey: ["work"],
        mutationFn: async (params: UpdateWorkProps) => {
            const result = await updateWork(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["works"] });
            queryClient.invalidateQueries({
                queryKey: ["single-work", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteWorkMutation = useMutation({
        mutationKey: ["work"],
        mutationFn: async (workId: number) => {
            const result = await deleteWork(workId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["works"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        createWorkMutation,
        updateWorkMutation,
        deleteWorkMutation,
    };
};
