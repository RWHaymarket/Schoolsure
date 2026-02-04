"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AccountLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      router.push("/account");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-grey-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="text-lg font-semibold text-navy">SchoolSure</div>
          <h1 className="mt-6 text-[24px] font-semibold text-navy">
            Sign in to your account
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-navy">
              Email
            </label>
            <Input type="email" placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-navy">
              Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-[14px] text-grey-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-grey-300" />
              Remember me
            </label>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
          <Link href="#" className="block text-center text-[14px] text-magenta">
            Forgot your password?
          </Link>
        </div>

        <div className="my-6 h-px bg-grey-300" />

        <div className="text-center text-[14px] text-grey-700">
          Don&apos;t have an account?{" "}
          <Link href="/quote/school" className="text-magenta font-semibold">
            Get a quote →
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-grey-500">
          <Lock className="h-4 w-4" />
          Secured by 256-bit encryption
        </div>
      </div>
    </div>
  );
}
