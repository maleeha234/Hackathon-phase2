"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { authApi, AuthError } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Better Auth
      await authApi.signIn({ email, password });

      // Redirect to dashboard on success
      router.push("/tasks");
    } catch (err) {
      const message = err instanceof AuthError ? err.detail : "Invalid email or password. Please try again.";
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
        <h1 className="text-h3 text-gray-900 mb-2">Welcome back</h1>
        <p className="text-body-sm text-gray-500">
          Enter your credentials to access your tasks
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          error={error}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-body-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
