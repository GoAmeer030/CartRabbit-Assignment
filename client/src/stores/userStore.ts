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

export interface WaitlistPosition {
    position: number;
}

interface UserState {
    user: User;
    setUser: (user: User) => void;
    fetchUser: (email: string) => void;
    registerUser: (name: string, email: string) => void;
    resetUser: () => void;
}

interface WaitlistPositionState {
    waitlistPosition: WaitlistPosition;
    setWaitlistPosition: (waitlistPosition: WaitlistPosition) => void;
    fetchWaitlistPosition: (id: number) => void;
}

const createUserFromData = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    isVerified: data.is_verified,
    referralCode: data.referral_code,
    referralCount: data.referral_count,
});

const saveUserToSessionStorage = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

const loadUserFromSessionStorage = (): User | null => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

const userInitialState: User = loadUserFromSessionStorage() || {
    id: 0,
    name: "",
    email: "",
    isVerified: false,
    referralCode: "",
    referralCount: 0,
};

export const useUserStore = create<UserState>((set) => ({
    user: userInitialState,
    setUser: (user) => {
        saveUserToSessionStorage(user);
        set({ user });
    },
    fetchUser: async (email) => {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/?email=${email}`);
        const user = createUserFromData(data);
        saveUserToSessionStorage(user);
        set({ user });
    },
    registerUser: async (name, email) => {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/`, { name, email });
        const user = createUserFromData(data);
        saveUserToSessionStorage(user);
        set({ user });
    },
    resetUser: () => {
        sessionStorage.removeItem('user');
        set({ user: userInitialState });
    },
}));

export const useWaitlistPositionStore = create<WaitlistPositionState>((set) => ({
    waitlistPosition: { position: 0 },
    setWaitlistPosition: (waitlistPosition) => set({ waitlistPosition }),
    fetchWaitlistPosition: async (id) => {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/waitlist/?id=${id}`);
        console.log(data);
        set({ waitlistPosition: data });
    },
}));