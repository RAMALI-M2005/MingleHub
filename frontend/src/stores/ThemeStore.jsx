import {create} from "zustand";

const useThemeStore = create((set) => ({
    theme: true,
    setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;