import {
    createSocial,
    deleteSocial,
    updateSocial,
} from "@/actions/social/social-crud";
import { socialMediaSchemaType } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateSocialProps {
    id: number;
    socialData: socialMediaSchemaType;
}

export const useSocialMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createSocialMutation = useMutation({
        mutationKey: ["social"],
        mutationFn: async (params: socialMediaSchemaType) => {
            const result = await createSocial(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["socials"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateSocialMutation = useMutation({
        mutationKey: ["social"],
        mutationFn: async (params: UpdateSocialProps) => {
            const result = await updateSocial(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["socials"] });
            queryClient.invalidateQueries({
                queryKey: ["single-social", data.data?.id],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteSocialMutation = useMutation({
        mutationKey: ["social"],
        mutationFn: async (socialId: number) => {
            const result = await deleteSocial(socialId);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["socials"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        createSocialMutation,
        updateSocialMutation,
        deleteSocialMutation,
    };
};
