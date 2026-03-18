import {
    createProject,
    deleteProject,
    updateProject,
} from "@/actions/project/project-crud";
import { projectSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateProjectProps {
    id: number;
    projectData: projectSchemaType;
}

export const useProjectMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const createProjectMutation = useMutation({
        mutationKey: ["project"],
        mutationFn: async (params: projectSchemaType) => {
            const result = await createProject(params);

            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
    const updateProjectMutation = useMutation({
        mutationKey: ["project"],
        mutationFn: async (params: UpdateProjectProps) => {
            const result = await updateProject(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            router.refresh();
            queryClient.invalidateQueries({
                queryKey: ["single-project", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
    const deleteProjectMutation = useMutation({
        mutationKey: ["project"],
        mutationFn: async (projectId: number) => {
            const result = await deleteProject(projectId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
    return {
        createProjectMutation,
        updateProjectMutation,
        deleteProjectMutation,
    };
};
