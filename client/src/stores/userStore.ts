import axios from "axios";
import { create } from "zustand";

export interface User {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
    referralCode: string;
    referralCount: number;
}

interface UserStore {
    user: User;
    setUser: (user: User) => void;
    fetchUser: (email: string) => void;
    registerUser: (name: string, email: string) => void;
    resetUser: () => void;
}

const createUserFromData = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    isVerified: data.is_verified,
    referralCode: data.referral_code,
    referralCount: data.referral_count,
});

const userInitialState: User = {
    id: 0,
    name: "",
    email: "",
    isVerified: false,
    referralCode: "",
    referralCount: 0,
};

export const useUserStore = create<UserStore>((set) => ({
    user: userInitialState,
    setUser: (user) => set({ user }),
    fetchUser: async (email) => {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/?email=${email}`);
        set({ user: createUserFromData(data) });
    },
    registerUser: async (name, email) => {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/`, { name, email });
        set({ user: createUserFromData(data) });
    },
    resetUser: () => set({ user: userInitialState }),
}));