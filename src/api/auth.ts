import { request, ApiError } from "./request";
export { ApiError };

type SignInInput = {
  email: string;
  password: string;
};

// Still fake for now: we connect login in the next task.
export async function signIn({ email, password }: SignInInput) {
  return request<{
    success: boolean;
    data: { user: { id: string; fullName: string; email: string } };
  }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Our servers are having trouble. Please try again in a moment.";
    }
    return "Something went wrong. Please try again.";
  }
  return "Can't reach MovieVerse. Check your internet connection and try again.";
}

type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
};

export async function signUp({ fullName, email, password }: SignUpInput) {
  return request<{
    success: boolean;
    data: { user: { id: string; fullName: string; email: string } };
  }>("/auth/register", {
    method: "POST",
    body: { fullName, email, password },
  });
}

export async function forgotPassword({ email }: { email: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { ok: true, email };
}

export async function getMe() {
  return request<{
    success: boolean;
    data: { user: { id: string; fullName: string; email: string; avatar: string } };
  }>("/auth/me");
}

export async function logout() {
  return request<{ success: boolean; message: string }>("/auth/logout", {
    method: "POST",
  });
}