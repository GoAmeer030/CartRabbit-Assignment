import axios from "axios";
import { create } from "zustand";

// User interface to define the structure of a user object
export interface User {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
    referralCode: string;
    referralCount: number;
}

// WaitlistPosition interface to define the structure of a waitlist position object
export interface WaitlistPosition {
    position: number;
}

// UserState interface to define the structure of the state and actions for user management
interface UserState {
    user: User;
    setUser: (user: User) => void;
    fetchUser: (email: string) => void;
    registerUser: (name: string, email: string, refCd: string) => void;
    resendVerificationEmail: (email: string) => void;
    resetUser: () => void;
}

// WaitlistPositionState interface to define the structure of the state and actions for waitlist position management
interface WaitlistPositionState {
    waitlistPosition: WaitlistPosition;
    setWaitlistPosition: (waitlistPosition: WaitlistPosition) => void;
    fetchWaitlistPosition: (id: number) => void;
}

// Utility function to create a User object from the raw data received from the server
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserFromData = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    isVerified: data.is_verified,
    referralCode: data.referral_code,
    referralCount: data.referral_count,
});

// Utility function to save the user data to the session storage
const saveUserToSessionStorage = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

// Utility function to load the user data from the session storage
const loadUserFromSessionStorage = (): User | null => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

// Initial state for the user, loaded from session storage if available, otherwise set to default values
const userInitialState: User = loadUserFromSessionStorage() || {
    id: 0,
    name: "",
    email: "",
    isVerified: false,
    referralCode: "",
    referralCount: 0,
};

// Zustand store for user state management
export const useUserStore = create<UserState>((set) => ({
    user: userInitialState,
    // Action to set the user state and save it to session storage
    setUser: (user) => {
        saveUserToSessionStorage(user);
        set({ user });
    },
    // Action to fetch user data from the server based on email and update the state
    fetchUser: async (email) => {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/?email=${email}`);
        const user = createUserFromData(data);
        saveUserToSessionStorage(user);
        set({ user });
    },
    // Action to register a new user, save to session storage, and update the state
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
    // Action to resend the verification email to the user
    resendVerificationEmail: async (email) => {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/resend-verification-email/`, { email });
    },
    // Action to reset the user state and remove user data from session storage
    resetUser: () => {
        sessionStorage.removeItem('user');
        set({ user: userInitialState });
    },
}));

// Zustand store for waitlist position state management
export const useWaitlistPositionStore = create<WaitlistPositionState>((set) => ({
    waitlistPosition: { position: 0 },
    // Action to set the waitlist position state
    setWaitlistPosition: (waitlistPosition) => set({ waitlistPosition }),
    // Action to fetch waitlist position data from the server based on user ID and update the state
    fetchWaitlistPosition: async (id) => {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/waitlist/?id=${id}`);
        set({ waitlistPosition: data });
    },
}));
