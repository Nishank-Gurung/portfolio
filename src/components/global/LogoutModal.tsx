import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoadingButton from "../ui/loading-button";
import { useTransition } from "react";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import APIRequest from "@/lib/BackendReq";
import { useRouter } from "next/navigation";

type LogoutModalProps = {
    isOpen?: boolean;
    closeModal?: () => void;
};

export default function LogoutModal({isOpen, closeModal}: LogoutModalProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const logout = async () =>{
        startTransition(async()=>{
            try {
                const res = await APIRequest.post("/api/auth/logout")
                 if (res.data.success) {
                                     router.push("/admin");
                                     showSuccessToast(res.data.message)
                                 } else {
                                     showErrorTost(res.data.message);
                                 }   
            } catch (error) {
                showErrorTost(error)
                
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <form>
                {/* <DialogTrigger asChild>
                    <Button variant="outline">Logout</Button>
                </DialogTrigger> */}
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
                        <LoadingButton loading={isPending} onClick={logout}>Logout</LoadingButton>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
