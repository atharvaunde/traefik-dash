"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Route, Server, Shield, Plug2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/routers", label: "Routers", icon: Route },
    { href: "/services", label: "Services", icon: Server },
    { href: "/middlewares", label: "Middlewares", icon: Shield },
    { href: "/entrypoints", label: "Entrypoints", icon: Plug2 },
]

export function MobileBottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t md:hidden bg-white dark:bg-inherit z-50">
            <div className="flex items-center justify-around h-16 px-2">
                {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-0 flex-1",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="text-[10px] font-medium truncate w-full text-center leading-tight">
                                {link.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
