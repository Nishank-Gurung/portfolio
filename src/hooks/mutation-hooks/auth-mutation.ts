import { login } from "@/actions/auth/login";
import { logout } from "@/actions/auth/logout";
import { ADMIN_DEFAULT_REDIRECT_URL } from "@/config/constant";
import { loginSchemaType } from "@/lib/schemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuthMutation = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: async (params: loginSchemaType) => {
            const result = await login(params);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.push(ADMIN_DEFAULT_REDIRECT_URL);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const logoutMutation = useMutation({
        mutationKey: ["auth", "logout"],
        mutationFn: async () => {
            const result = await logout();
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            router.push("/admin");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        loginMutation,
        logoutMutation,
    };
};
