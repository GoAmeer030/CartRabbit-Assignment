import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from "react";
import { useLocation } from 'react-router-dom';

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useParamStore } from '@/stores/paramStore';
import { useUserStore } from '@/stores/userStore';
import { AxiosError } from 'axios';

export default function UserRegisterForm() {
    const userRegisterSchema = z.object({
        name: z.string().min(3).max(20),
        email: z.string().email(),
        referralCode: z.string().optional(),
    });

    const { toast } = useToast();

    const { setRegisterDialogTrigger } = useParamStore();
    const { user, registerUser } = useUserStore();

    const queryParams = new URLSearchParams(useLocation().search);
    const refCd = queryParams.get("refCd");

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>(user.email);
    const [referralCode, setReferralCode] = useState<string>(refCd || "");

    const form = useForm<z.infer<typeof userRegisterSchema>>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: {
            name: "",
            email: user.email,
            referralCode: referralCode,
        }
    });

    const handleSave = async () => {
        try {
            await registerUser(name, email, referralCode);
            setRegisterDialogTrigger(false);

            toast({
                description: "Account has created successfully. Verification email has been sent to your email.",
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast({
                    description: "Bad request. Please check your inputs and try again.",
                    variant: "destructive"
                });
            } else {
                toast({
                    description: "Something went wrong, please try again later.",
                    variant: "destructive"
                });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="flex flex-col gap-3 mt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-right">Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="My Name is ;)"
                                    {...field}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        field.onChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 text-[0.7rem]" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-right">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="youremail@domain.com"
                                    {...field}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        field.onChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 text-[0.7rem]" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-right">Refferal Code</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Leave empty if you don't have one!"
                                    {...field}
                                    onChange={(e) => {
                                        setReferralCode(e.target.value);
                                        field.onChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 text-[0.7rem]" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-3">
                    Register
                </Button>
            </form>
        </Form>
    )
}