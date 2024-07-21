import { create } from "zustand";

// ParamState interface to define the structure of the state and actions for parameter management
interface ParamState {
    registerDialogTrigger: boolean;
    setRegisterDialogTrigger: (trigger: boolean) => void;
}

// Zustand store for parameter state management
export const useParamStore = create<ParamState>((set) => ({
    registerDialogTrigger: false,
    setRegisterDialogTrigger: (trigger) => set({ registerDialogTrigger: trigger }), // Action to set the registerDialogTrigger state
}));
