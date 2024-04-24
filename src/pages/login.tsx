import {useLoginStore} from "@/store/login-store";

export function Login() {
    const loginGoogle = useLoginStore((state) => state.loginGoogle);

    return (
        <section
            className="flex justify-center flex-col items-center px-10 py-14  border-2 border-white/20 bg-transparent w-[350px] rounded-3xl text-white gap-3 backdrop-blur-[25px]"
            style={{boxShadow: "0 0 10px rgba(0, 0, 0, .2)"}}
        >
            <span>Log in to stay organized!</span>
            <button
                className="flex justify-center items-center gap-2 rounded-lg text-[#808080] py-2 px-6 bg-[#EFEFEF]"
                onClick={loginGoogle}
            >
                <img alt="Google icon" src="/google.svg" />
                Log in with Google
            </button>
        </section>
    );
}
