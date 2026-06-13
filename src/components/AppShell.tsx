import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Trophy, Store, Sparkles, Users, User } from "lucide-react";

const TABS = [
  { to: "/", label: "首页", icon: Home },
  { to: "/challenges", label: "挑战", icon: Trophy },
  { to: "/shop", label: "商店", icon: Store },
  { to: "/pet", label: "宠物", icon: Sparkles },
  { to: "/friends", label: "好友", icon: Users },
  { to: "/me", label: "我的", icon: User },
] as const;

export function AppShell({ children, bgClass = "bg-background" }: { children: ReactNode; bgClass?: string }) {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <main className={`flex-1 pb-24 ${bgClass}`}>{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-md">
        <ul className="grid grid-cols-6 px-1 pb-2 pt-2">
          {TABS.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <li key={t.to} className="flex">
                <Link
                  to={t.to}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors ${
                    active ? "bg-secondary text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
