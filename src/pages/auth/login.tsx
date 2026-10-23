import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthLayout from "../../layout/AuthLayout";
import Button from "../../component/Button";
import Input from "../../component/input";
import { validateEmail, validatePassword } from "../../utils/validator";
import { ApiError, getErrorMessage, signIn } from "../../api/auth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAuth } from "../../hooks/useAuth";
import { AppleIcon, GoogleIcon } from "../../component/socialIcons";

export default function SignIn() {
    usePageTitle("Sign In");
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? "/";
    const { signIn: saveUser } = useAuth();


    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const signInMutation = useMutation({
        mutationFn: signIn,
        onSuccess: () => {
            saveUser({ email: email.trim() });
            toast.success("Welcome back!");
            navigate(from, { replace: true });;
        },
        onError: (error) => {
            // 401 is shown inline below, so no toast for it
            if (error instanceof ApiError && error.status === 401) return;
            toast.error(getErrorMessage(error), { id: "signin-error" });
        },
    });

    const isAuthError =
        signInMutation.error instanceof ApiError && signInMutation.error.status === 401;

    function clearRequestError() {
        if (signInMutation.isError) signInMutation.reset();
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setEmail(value);
        if (emailTouched) setEmailError(validateEmail(value));
        clearRequestError();
    }

    function handleEmailBlur() {
        setEmailTouched(true);
        setEmailError(validateEmail(email));
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        if (passwordError) setPasswordError("");
        clearRequestError();
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (signInMutation.isPending) return;

        setEmailTouched(true);
        const emailProblem = validateEmail(email);
        const passwordProblem = validatePassword(password);
        setEmailError(emailProblem);
        setPasswordError(passwordProblem);

        if (emailProblem || passwordProblem) return;

        signInMutation.mutate({ email: email.trim(), password });
    }

    return (
        <AuthLayout>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="mt-2 text-muted">Sign in to your account to continue</p>

            <div className="mt-8 space-y-3">
                <Button type="button" variant="social">
                    <GoogleIcon/>
                    Continue with Google
                </Button>
                <Button type="button" variant="social">
                    <AppleIcon/>
                    Continue with Apple
                </Button>
            </div>

            <div className="my-6 flex items-center gap-4 text-sm text-muted">
                <span className="h-px flex-1 bg-line" />
                or
                <span className="h-px flex-1 bg-line" />
            </div>

            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
                {isAuthError && (
                    <p
                        role="alert"
                        className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
                    >
                        Unable to sign in. Please check your email and password and try again.
                    </p>
                )}

                <Input
                    label="Email address"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    error={emailError}
                />

                <Input
                    label="Password"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                />

                <div className="text-right">
                    <Link
                        to="/forgotPassword"
                        className="text-sm text-muted transition duration-200 hover:text-accent-hover"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={signInMutation.isPending}
                    aria-busy={signInMutation.isPending}
                >
                    {signInMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>

                <p className="mt-8 text-center text-sm text-muted">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-accent transition duration-200 hover:text-accent-hover"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}