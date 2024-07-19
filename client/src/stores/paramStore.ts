import { create } from "zustand";

interface ParamState {
    registerDialogTrigger: boolean;
    setRegisterDialogTrigger: (trigger: boolean) => void;
}

export const useParamStore = create<ParamState>((set) => ({
    registerDialogTrigger: false,
    setRegisterDialogTrigger: (trigger) => set({ registerDialogTrigger: trigger }),
}));