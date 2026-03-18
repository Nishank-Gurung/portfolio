import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "../ui/loading-button";
import { useAuthMutation } from "@/hooks/mutation-hooks/auth-mutation";

type LogoutModalProps = {
    isOpen?: boolean;
    closeModal?: () => void;
};

export default function LogoutModal({ isOpen, closeModal }: LogoutModalProps) {
    const { logoutMutation } = useAuthMutation();

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <form>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {" "}
                            Are You Sure You Want to Log Out?
                        </DialogTitle>
                        <DialogDescription>
                            You are about to log out of your account. Are you
                            sure you want to leave?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <LoadingButton
                            loading={logoutMutation.isPending}
                            onClick={() => logoutMutation.mutate()}
                        >
                            Logout
                        </LoadingButton>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
