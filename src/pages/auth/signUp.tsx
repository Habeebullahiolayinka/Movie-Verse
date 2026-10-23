

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthLayout from "../../layout/AuthLayout";
import Button from "../../component/Button";
import Input from "../../component/input";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
} from "../../utils/validator";
import { ApiError, getErrorMessage, signUp } from "../../api/auth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { AppleIcon, GoogleIcon } from "../../component/socialIcons";

export default function SignUp() {
  usePageTitle("Create Account");
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Account created! Please sign in.");
      navigate("/signin");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        setErrors((current) => ({
          ...current,
          email: "Unable to create an account with this email.",
        }));
        return;
      }
      toast.error(getErrorMessage(error), { id: "signup-error" });
    },
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleTermsChange(event: ChangeEvent<HTMLInputElement>) {
    setValues((current) => ({ ...current, acceptedTerms: event.target.checked }));
    setErrors((current) => ({ ...current, terms: "" }));
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { name } = event.target;
    setErrors((current) => ({ ...current, ...validateField(name) }));
  }

  function validateField(name: string) {
    switch (name) {
      case "fullName":
        return { fullName: validateFullName(values.fullName) };
      case "email":
        return { email: validateEmail(values.email) };
      case "password":
        return { password: validatePassword(values.password) };
      case "confirmPassword":
        return {
          confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
        };
      default:
        return {};
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signUpMutation.isPending) return;

    const nextErrors = {
      fullName: validateFullName(values.fullName),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
      terms: validateTerms(values.acceptedTerms),
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    signUpMutation.mutate({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
    });
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight">Create Your Account</h1>
      <p className="mt-2 text-muted">Join MovieVerse and start streaming today</p>

      <div className="mt-8 space-y-3">
        <Button type="button" variant="social">
          <GoogleIcon />
          Continue with Google
        </Button>
        <Button type="button" variant="social">
          <AppleIcon />
          Continue with Apple
        </Button>
      </div>

      <div className="my-6 flex items-center gap-4 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          id="fullName"
          autoComplete="name"
          placeholder="Your full name"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
        />

        {/* Terms checkbox from Step 4 goes here */}
        <div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={values.acceptedTerms}
              onChange={handleTermsChange}
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? "terms-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="font-semibold text-accent-hover hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-semibold text-accent-hover hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p id="terms-error" role="alert" className="mt-2 text-sm text-danger">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" disabled={signUpMutation.isPending} aria-busy={signUpMutation.isPending}>
          {signUpMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-accent transition duration-200 hover:text-accent-hover"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}