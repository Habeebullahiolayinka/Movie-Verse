import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthLayout from "../../layout/AuthLayout";
import Button from "../../component/Button";
import Input from "../../component/input";
import { validateEmail } from "../../utils/validator";
import { forgotPassword, getErrorMessage } from "../../api/auth";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function Forgot() {
    usePageTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const resetMutation = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      toast.error(getErrorMessage(error), { id: "forgot-error" });
    },
  });

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEmail(value);
    if (emailTouched) setEmailError(validateEmail(value));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resetMutation.isPending) return;

    setEmailTouched(true);
    const problem = validateEmail(email);
    setEmailError(problem);
    if (problem) return;

    resetMutation.mutate({ email: email.trim() });
  }

  function handleTryAnother() {
    resetMutation.reset();
    setEmail("");
    setEmailError("");
    setEmailTouched(false);
  }

  return (
    <AuthLayout>
      {resetMutation.isSuccess ? (
        <div role="status">
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="mt-3 text-muted">
            If an account exists for{" "}
            <span className="font-medium text-ink">{email.trim()}</span>, we've sent a password
            reset link. It may take a few minutes to arrive, so check your spam folder too.
          </p>

          <Button type="button" variant="social" className="mt-8" onClick={handleTryAnother}>
            Use a different email
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Forgot your password?</h1>
          <p className="mt-2 text-muted">
            Enter your email and we'll send you a password reset link.
          </p>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              disabled={resetMutation.isPending}
              aria-busy={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        <Link
          to="/login"
          className="font-semibold text-accent transition duration-200 hover:text-accent-hover"
        >
          ← Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}