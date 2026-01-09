"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { authApi, AuthError } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Better Auth
      await authApi.signUp({ email, password, name });

      // Redirect to dashboard on success
      router.push("/tasks");
    } catch (err) {
      const message = err instanceof AuthError ? err.detail : "Failed to create account. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      {/* Logo */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-h3 text-gray-900 mb-2">Create an account</h1>
        <p className="text-body-sm text-gray-500">
          Get started with your todo list today
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          error={error}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-body-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Terms */}
      <p className="mt-4 text-center text-xs text-gray-400">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </Card>
  );
}
