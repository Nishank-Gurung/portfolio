import {
    createEducation,
    deleteEducation,
    updateEducation,
} from "@/actions/education/education-crud";
import { educationSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateEducationProps {
    id: number;
    educationData: educationSchemaType;
}

export const useEducationMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createEducationMutation = useMutation({
        mutationKey: ["education"],
        mutationFn: async (params: educationSchemaType) => {
            const result = await createEducation(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["educations"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateEducationMutation = useMutation({
        mutationKey: ["education"],
        mutationFn: async (params: UpdateEducationProps) => {
            const result = await updateEducation(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["educations"] });
            queryClient.invalidateQueries({
                queryKey: ["single-education", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteEducationMutation = useMutation({
        mutationKey: ["education"],
        mutationFn: async (educationId: number) => {
            const result = await deleteEducation(educationId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["educations"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        createEducationMutation,
        updateEducationMutation,
        deleteEducationMutation,
    };
};
