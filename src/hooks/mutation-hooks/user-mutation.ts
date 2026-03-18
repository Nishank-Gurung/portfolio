import { updateUser } from "@/actions/user/user-crud";
import { userSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUserMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const updateUserMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: async (params: userSchemaType) => {
            const result = await updateUser(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        updateUserMutation,
    };
};
