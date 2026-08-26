"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/auth-provider";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/toast";
import { errorMessage } from "@/lib/errors";

export function LoginScreen() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.show({ type: "error", text1: "Error", text2: "Please fill in all fields" });
      return;
    }
    setPending(true);
    try {
      await login(email.trim(), password);
      toast.show({ type: "success", text1: "Success", text2: "Login successful!" });
      router.replace("/");
    } catch (err) {
      toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage(err, "Login failed"),
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between p-12 text-on-primary">
        <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-secondary/25" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-accent/20" />
        <div className="relative">
          <img src="/sunnah.png" alt="" className="h-16 w-16 rounded-2xl object-cover" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-accent">
            Admin console
          </p>
          <h1 className="mt-3 max-w-md text-4xl font-bold leading-tight">
            Enter verified Ahadees for Sunnah-Ilm
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-on-primary/80">
            Same corpus as the mobile app. Admin accounts only.
          </p>
        </div>
        <p className="relative text-sm text-on-primary/70">Sunnah-Ilm</p>
      </section>

      <section className="flex items-center justify-center bg-background px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <img
            src="/sunnah.png"
            alt="Sunnah-Ilm"
            className="mb-6 h-14 w-14 rounded-2xl object-cover lg:hidden"
          />
          <h2 className="text-3xl font-bold text-text">Sign in</h2>
          <p className="mt-2 text-sm text-muted">Use your admin email and password.</p>

          <label className="mt-8 mb-2 block text-sm font-semibold text-text">Email</label>
          <div className="flex items-center rounded-xl border border-border bg-card">
            <span className="px-3 text-muted">
              <Icon name="mail" size={20} />
            </span>
            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full bg-transparent pr-4 text-base text-text outline-none placeholder:text-muted"
            />
          </div>

          <label className="mt-5 mb-2 block text-sm font-semibold text-text">Password</label>
          <div className="flex items-center rounded-xl border border-border bg-card">
            <span className="px-3 text-muted">
              <Icon name="lock" size={20} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full bg-transparent text-base text-text outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="px-3 text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "eye" : "eye-off"} size={22} />
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-on-primary hover:opacity-95 disabled:opacity-70"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </section>
    </div>
  );
}
