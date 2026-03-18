import {
    createSkill,
    deleteSkill,
    updateSkill,
} from "@/actions/skill/skill-crud";
import { skillSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateSkillProps {
    id: number;
    skillData: skillSchemaType;
}

export const useSkillMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createSkillMutation = useMutation({
        mutationKey: ["skill"],
        mutationFn: async (params: skillSchemaType) => {
            const result = await createSkill(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateSkillMutation = useMutation({
        mutationKey: ["skill"],
        mutationFn: async (params: UpdateSkillProps) => {
            const result = await updateSkill(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            queryClient.invalidateQueries({
                queryKey: ["single-skill", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteSkillMutation = useMutation({
        mutationKey: ["skill"],
        mutationFn: async (skillId: number) => {
            const result = await deleteSkill(skillId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        createSkillMutation,
        updateSkillMutation,
        deleteSkillMutation,
    };
};
