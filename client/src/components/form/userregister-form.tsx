import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from "react";

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

export default function UserRegisterForm() {
    const userRegisterSchema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
    });

    const { toast } = useToast();

    const { user, registerUser } = useUserStore();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>(user.email);

    const form = useForm<z.infer<typeof userRegisterSchema>>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: {
            name: "",
            email: user.email,
        }
    });

    const handleSave = async () => {
        try {
            registerUser(name, email);
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: "Something went worng, please try again later.",
                variant: "destructive"
            });
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
                <Button type="submit" className="w-full mt-3">
                    Register
                </Button>
            </form>
        </Form>
    )
}