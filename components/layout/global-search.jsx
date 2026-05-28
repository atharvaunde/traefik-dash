"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Route, Server, Shield, Search } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import useTraefikStore from "@/lib/stores/traefik-store";

export function GlobalSearch() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { httpRouters, httpServices, httpMiddlewares } = useTraefikStore();

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const handleSelect = (href) => {
        setOpen(false);
        router.push(href);
    };

    const pages = [
        { label: "Dashboard", href: "/" },
        { label: "Routers", href: "/routers" },
        { label: "Services", href: "/services" },
        { label: "Middlewares", href: "/middlewares" },
        { label: "Entrypoints", href: "/entrypoints" },
        { label: "Settings", href: "/settings" },
    ];

    return (
        <>
            <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 text-muted-foreground w-64 justify-between px-3 h-9"
                onClick={() => setOpen(true)}
            >
                <span className="flex items-center gap-2 text-sm">
                    <Search className="h-3.5 w-3.5" />
                    Search...
                </span>
                <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search routers, services, middlewares..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Pages">
                        {pages.map((page) => (
                            <CommandItem
                                key={page.href}
                                value={page.label}
                                onSelect={() => handleSelect(page.href)}
                            >
                                {page.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    {httpRouters.length > 0 && (
                        <CommandGroup heading="HTTP Routers">
                            {httpRouters.slice(0, 10).map((r) => (
                                <CommandItem
                                    key={r.name}
                                    value={`router ${r.name} ${r.rule}`}
                                    onSelect={() => handleSelect("/routers")}
                                >
                                    <Route className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
                                    <span className="truncate">{r.name}</span>
                                    {r.rule && <span className="ml-2 text-xs text-muted-foreground truncate">{r.rule}</span>}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {httpServices.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="HTTP Services">
                                {httpServices.slice(0, 10).map((s) => (
                                    <CommandItem
                                        key={s.name}
                                        value={`service ${s.name} ${s.provider}`}
                                        onSelect={() => handleSelect("/services")}
                                    >
                                        <Server className="h-4 w-4 mr-2 shrink-0 text-purple-500" />
                                        <span className="truncate">{s.name}</span>
                                        {s.provider && <span className="ml-2 text-xs text-muted-foreground">{s.provider}</span>}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    {httpMiddlewares.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="HTTP Middlewares">
                                {httpMiddlewares.slice(0, 10).map((m) => (
                                    <CommandItem
                                        key={m.name}
                                        value={`middleware ${m.name} ${m.type}`}
                                        onSelect={() => handleSelect("/middlewares")}
                                    >
                                        <Shield className="h-4 w-4 mr-2 shrink-0 text-amber-500" />
                                        <span className="truncate">{m.name}</span>
                                        {m.type && <span className="ml-2 text-xs text-muted-foreground">{m.type}</span>}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
