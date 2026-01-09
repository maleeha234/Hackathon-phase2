"use client";

import { LandingHeader } from "@/components/landing/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Zap,
  CheckSquare,
  CheckCircle,
  ArrowRight,
  Mouse,
  Bolt,
  Lock,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: Mouse,
    title: "Simple",
    description: "Intuitive design that gets out of your way",
  },
  {
    icon: Bolt,
    title: "Fast",
    description: "Lightning quick interactions and sync",
  },
  {
    icon: Lock,
    title: "Secure",
    description: "Your data is encrypted and protected",
  },
  {
    icon: User,
    title: "Yours",
    description: "Private by default, no tracking, no ads",
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-h1 text-gray-900 mb-6 tracking-tight">
            Beautiful,
            <br />
            Effortless.
          </h1>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto mb-10">
            The todo app you&apos;ve been waiting for. Minimal. Powerful. Yours.
          </p>

          {/* Email capture form */}
          <form
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Implement email capture
              console.log("Email submitted:", email);
            }}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" size="lg">
              Get Started
            </Button>
          </form>

          {/* Dashboard preview placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="aspect-video bg-gray-50 rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Dashboard Preview</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Screenshot will go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-h4 text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-body-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 rounded-2xl p-10 md:p-16">
            <h2 className="text-h2 text-gray-900 mb-4">
              Ready to get things done?
            </h2>
            <p className="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Join thousands of people who have simplified their life with Todo.
              Start being productive today.
            </p>
            <Link href="/sign-up">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Todo</span>
            </div>
            <p className="text-body-sm text-gray-500">
              &copy; {new Date().getFullYear()} The Evolution of Todo. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
