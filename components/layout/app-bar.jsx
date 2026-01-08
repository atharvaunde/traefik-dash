'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Route, Server, Shield, Plug2, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

export function AppBar() {
    const pathname = usePathname()
    const navLinks = [
        { href: "/", label: "Dashboard", icon: BarChart3 },
        { href: "/routers", label: "Routers", icon: Route },
        { href: "/services", label: "Services", icon: Server },
        { href: "/middlewares", label: "Middlewares", icon: Shield },
        { href: "/entrypoints", label: "Entrypoints", icon: Plug2 },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-16 flex items-center justify-between px-4 container mx-auto">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <Image src="/logo.png" alt="Logo" width={30} height={30} />
                    <span>Traefik.io</span>
                </Link>

                <nav className="hidden md:flex gap-2 px-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Link href="/settings">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}