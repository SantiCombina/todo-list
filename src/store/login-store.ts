import {create} from "zustand";
import {Session} from "@supabase/supabase-js";

import {supabase} from "@/supabase/supabase";

interface LoginStore {
    session: Session | null | undefined;
    isLogged: boolean;
    loading: boolean;
    loginGoogle: () => void;
    logout: () => void;
    checkUser: () => void;
}

export const useLoginStore = create<LoginStore>()((set) => ({
    session: undefined,
    isLogged: false,
    loading: true,
    checkUser: async () => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event || session) {
                set({session: session});
            } else {
                set({session: null});
            }
        });
    },
    loginGoogle: async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                queryParams: {prompt: "select_account"},
                redirectTo: "https://todo-list-umber-three.vercel.app/",
            },
        });
        set({
            isLogged: true,
            loading: false,
        });
    },
    logout: async () => {
        set({
            loading: true,
        });
        await supabase.auth.signOut();
        set({
            isLogged: false,
            loading: false,
        });
    },
}));
