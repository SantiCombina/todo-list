import {Navigate, Outlet} from "react-router-dom";
import {useEffect} from "react";

import {useLoginStore} from "@/store/login-store";

export function ProtectedPage() {
    const session = useLoginStore((state) => state.session);
    const checkUser = useLoginStore((state) => state.checkUser);
    const loading = useLoginStore((state) => state.loading);

    console.log(session);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    if (!session && !loading) {
        return <Navigate replace to="/login" />;
    }

    return <Outlet />;
}
