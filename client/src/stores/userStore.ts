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
    registerUser: (name: string, email: string, refCd: string) => void;
    resetUser: () => void;
}

interface WaitlistPositionState {
    waitlistPosition: WaitlistPosition;
    setWaitlistPosition: (waitlistPosition: WaitlistPosition) => void;
    fetchWaitlistPosition: (id: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    registerUser: async (name, email, refCd) => {
        const url = `${import.meta.env.VITE_SERVER_URL}/auth/${refCd ? `${refCd}/` : ''}`;
        const { data, status } = await axios.post(url, { name, email });
        if (status === 201) {
            const user = createUserFromData(data);
            saveUserToSessionStorage(user);
            set({ user });
        } else if (status === 400) {
            throw new Error('Bad request');
        } else {
            throw new Error('Internal server error');
        }
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