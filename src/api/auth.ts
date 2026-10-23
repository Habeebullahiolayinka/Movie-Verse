export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type SignInInput = {
  email: string;
  password: string;
};

// Fake backend for now: waits 1 second, accepts one password.
export async function signIn({ email, password }: SignInInput) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (password !== "password123") {
    throw new ApiError("Invalid credentials", 401);
  }

  return { user: { email } };
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

export async function signUp({ fullName, email }: SignUpInput) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (email.toLowerCase() === "taken@example.com") {
    throw new ApiError("Email already registered", 409);
  }

  return { user: { fullName, email } };
}


export async function forgotPassword({ email }: { email: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { ok: true, email };
}