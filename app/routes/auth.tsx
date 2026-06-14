import { useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useLocation } from "react-router";

export const meta = () => [
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account" },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next =
        new URLSearchParams(location.search).get("next");
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next ?? "/");
        }
    }, [auth.isAuthenticated, navigate, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col items-center gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>

                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Signing you in..</p>
                        </button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}>
                                    <p>Log Out</p>
                                </button>
                            ) : (
                                <button className="auth-button" onClick={auth.signIn}>
                                    <p> Log In </p>
                                </button>

                            )}

                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Auth;