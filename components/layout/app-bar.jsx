"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Route,
  Server,
  Shield,
  Plug2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import useTraefikStore from "@/lib/stores/traefik-store";
import { formatTimeAgo } from "@/lib/helpers/version-check";
import { GlobalSearch } from "@/components/layout/global-search";

const navLinks = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/routers", label: "Routers", icon: Route },
  { href: "/services", label: "Services", icon: Server },
  { href: "/middlewares", label: "Middlewares", icon: Shield },
  { href: "/entrypoints", label: "Entrypoints", icon: Plug2 },
];

export function AppBar() {
  const pathname = usePathname();
  const { errors, lastFetchedAt, loading } = useTraefikStore();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceUpdate((n) => n + 1), 10_000);
    return () => clearInterval(timer);
  }, []);

  const isLoading = Object.values(loading).some(Boolean);
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 flex items-center gap-4 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold shrink-0"
        >
          <Image src="/logo.png" alt="Logo" width={26} height={26} />
          <span className="text-sm font-semibold">Traefik.io</span>
        </Link>

        <div className="hidden md:block h-5 w-px bg-border shrink-0" />

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: staleness + errors + search + actions */}
        <div className="flex items-center gap-2">
          {lastFetchedAt && !isLoading && (
            <span className="hidden lg:block text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(new Date(lastFetchedAt).toISOString())}
            </span>
          )}
          {errorCount > 0 && (
            <span className="hidden md:flex items-center rounded-full bg-red-500/10 border border-red-500/30 text-red-600 text-xs px-2 py-0.5 whitespace-nowrap">
              {errorCount} error{errorCount > 1 ? "s" : ""}
            </span>
          )}
          <GlobalSearch />
          <ModeToggle />
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
