import {create} from "zustand";
import {Session} from "@supabase/supabase-js";

import {supabase} from "@/supabase/supabase";

interface LoginStore {
    session: Session | null;
    isLogged: boolean;
    loginGoogle: () => void;
    logout: () => void;
    checkUser: () => void;
}

export const useLoginStore = create<LoginStore>()((set) => ({
    session: null,
    isLogged: false,
    loginGoogle: async () =>
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: {queryParams: {prompt: "select_account"}},
        }),
    logout: () => {
        supabase.auth.signOut();
        set({isLogged: false});
    },
    checkUser: async () => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event || session) {
                set({session: session});
            } else {
                set({session: null});
            }
        });
    },
}));
