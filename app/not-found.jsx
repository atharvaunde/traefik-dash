'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Home,
    TriangleAlert,
    RefreshCw
} from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden min-h-[calc(100vh-4rem)]">
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        404
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground font-mono">
                        <TriangleAlert className="w-4 h-4" />
                        <span>ROUTE_NOT_FOUND</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Page Not Found
                    </h2>

                    <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't route your request to this destination.
                        The page you're looking for doesn't exist or may have been moved to another location.
                    </p>

                    <div className="bg-muted/50 border border-border rounded-lg p-4 max-w-md mx-auto mt-6">
                        <div className="space-y-2 text-sm font-mono text-left">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="text-destructive font-semibold">404 Not Found</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Proxy:</span>
                                <span>Traefik Dashboard</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Action:</span>
                                <span className="text-primary">Check your URL</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Go to Dashboard
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </Button>
                </div>


            </div>
        </div>

    );
}
