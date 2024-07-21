/**
 * Email Form Component
 * 
 * This component is responsible for rendering the email form.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from "react";
import { AxiosError } from 'axios';

import { ArrowRight } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useUserStore } from '@/stores/userStore';
import { useParamStore } from '@/stores/paramStore';

export default function EmailForm() {
    const emailSchema = z.object({
        email: z.string().email(),
    });

    const { user, fetchUser } = useUserStore();
    const [email, setEmail] = useState<string>(user.email);

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: user.email,
        }
    });

    const { toast } = useToast();

    const { setRegisterDialogTrigger } = useParamStore();

    const handleGet = async () => {
        try {
            await fetchUser(email);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 404) {
                toast({
                    description: "User not found!! Please enter user name to continue",
                    variant: "destructive"
                })
                user.email = email;
                setRegisterDialogTrigger(true);
            }
            else {
                toast({
                    description: "An error occurred!! Please try again later",
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGet)} className="flex flex-row gap-2 lg:w-96 md:w-96 w-full justify-center items-center">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-4/6">
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your email here!! 👇"
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
                <Button type="submit" className="w-2/6">
                    Continue
                    <ArrowRight className="lg:h-5 lg:w-5 md:h-5 md:w-5 h-8 w-8 lg:ml-2 ml-1" />
                </Button>
            </form>
        </Form>
    )
}