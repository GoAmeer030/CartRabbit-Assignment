/**
 * User Register Dialog
 * 
 * This component displays a dialog for user registration.
 */

import UserRegisterForm from "@/components/form/userregister-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { useParamStore } from '@/stores/paramStore';

export default function UserRegisterDialog() {
    const { registerDialogTrigger, setRegisterDialogTrigger } = useParamStore();

    return (
        <Dialog
            open={registerDialogTrigger}
            onOpenChange={(open) => {
                setRegisterDialogTrigger(open);
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Register</DialogTitle>
                    <DialogDescription>
                        Register to get started
                    </DialogDescription>
                </DialogHeader>
                <UserRegisterForm />
            </DialogContent>
        </Dialog>
    );
}