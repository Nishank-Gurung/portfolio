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

type DeleteModalProps = {
    isPending: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    onDelete: () => void;
};

export default function DeleteModal({isOpen, onClose, onDelete, isPending}: DeleteModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <form>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {" "}
                            Are You Sure You Want to Delete?
                        </DialogTitle>
                        <DialogDescription>
                            You are about to delete this item. Are you
                            sure you want to proceed?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <LoadingButton loading={isPending} onClick={onDelete}>Delete</LoadingButton>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
