"use client";

import Link from "next/link";
import { useAuth } from "@/auth/auth-provider";
import { Icon } from "@/components/icon";

const actions = [
  {
    href: "/add",
    title: "Add Hadith",
    copy: "Enter a verified Bukhari or Muslim narration.",
    icon: "add" as const,
  },
  {
    href: "/hadiths",
    title: "Manage Hadiths",
    copy: "Search, edit, and delete existing rows.",
    icon: "book" as const,
  },
  {
    href: "/saved",
    title: "Saved Hadiths",
    copy: "Bookmarks you have already opened.",
    icon: "bookmark" as const,
  },
  {
    href: "/profile",
    title: "Profile",
    copy: "Account details for this admin.",
    icon: "person" as const,
  },
];

export function HomeScreen() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "friend";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-semibold text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-bold text-text">Salaam, {firstName}</h1>
        <p className="mt-2 text-sm text-muted">{today} · same Neon corpus as the app</p>
      </header>

      <section className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-accent px-8 py-10">
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-secondary/25" />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold text-primary">Hadiths</p>
          <h2 className="mt-2 text-3xl font-bold text-text">
            Add authentic Ahadees from the website
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Type the narration, translation, grade, and topic. The mobile app reads
            the same table.
          </p>
          <Link
            href="/add"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
          >
            <Icon name="add" size={18} />
            Add Hadith
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-border bg-card p-6 hover:border-primary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon name={action.icon} size={18} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-text">{action.title}</h3>
            <p className="mt-1 text-sm text-muted">{action.copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
