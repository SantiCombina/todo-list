import {Navigate, Outlet} from "react-router-dom";
import {useEffect, useState} from "react";

import {Spinner} from "./spinner";

import {supabase} from "@/supabase/supabase";
import {useLoginStore} from "@/store/login-store";

export function ProtectedRoute() {
    const [logged, setLogged] = useState<boolean | null>(null);
    const session = useLoginStore((state) => state.session);
    const loading = useLoginStore((state) => state.loading);

    useEffect(() => {
        const checkSession = async () => {
            const getSession = await supabase.auth.getSession();

            setLogged(getSession?.data?.session?.access_token ? true : false);
        };

        checkSession();
    }, [session]);

    if (logged === null && loading) {
        return <Spinner />;
    }

    if (!logged) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}
