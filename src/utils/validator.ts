


export function validateEmail(value: string): string {
  const email = value.trim();

  if (!email) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}


export function validatePassword(value: string): string {
  if (!value) return "Please enter your password.";
  if (value.length < 8) return "Password must contain at least 8 characters.";
  return "";
}


export function validateFullName(value: string): string {
  if (!value.trim()) return "Please enter your full name.";
  return "";
}

export function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
}

export function validateTerms(accepted: boolean): string {
  if (!accepted) return "You must accept the Terms of Service and Privacy Policy.";
  return "";
}