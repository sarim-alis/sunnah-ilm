"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useToggleMode } from "@/auth/auth-provider";
import { Icon, type IconName } from "@/components/icon";
import { errorMessage } from "@/lib/errors";
import { useToast } from "@/components/toast";

type NavItem = {
  href: string;
  label: string;
  idle: IconName;
  active: IconName;
};

const nav: NavItem[] = [
  { href: "/", label: "Home", idle: "home-outline", active: "home" },
  { href: "/hadiths", label: "Hadiths", idle: "book-outline", active: "book" },
  { href: "/add", label: "Add Hadith", idle: "add", active: "add" },
  { href: "/saved", label: "Saved", idle: "bookmark-outline", active: "bookmark" },
  { href: "/profile", label: "Profile", idle: "person-outline", active: "person" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const toggleMode = useToggleMode();
  const toast = useToast();
  const initial = user?.name?.charAt(0).toUpperCase() ?? "A";

  return (
    <aside className="flex h-dvh w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <img src="/sunnah.png" alt="" className="h-10 w-10 rounded-xl object-cover" />
        <div>
          <p className="text-sm font-bold text-text">Sunnah-Ilm</p>
          <p className="text-xs text-muted">Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-text hover:bg-background"
              }`}
            >
              <Icon name={active ? item.active : item.idle} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-primary">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            void toggleMode().catch((err) => {
              toast.show({
                type: "error",
                text1: "Update Failed",
                text2: errorMessage(err, "Could not update theme"),
              });
            });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text hover:bg-background"
        >
          <Icon name={user?.mode === "dark" ? "sun" : "moon"} size={16} />
          {user?.mode === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}
