"use client";

import { useState, useEffect } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function Page() {
    const { traefikEndpoint, setTraefikEndpoint } = useTraefikStore();
    const [endpoint, setEndpoint] = useState("");
    const [saved, setSaved] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        setEndpoint(traefikEndpoint);
    }, [traefikEndpoint]);

    const handleSave = () => {
        if (!endpoint.trim()) {
            toast.error("Endpoint URL cannot be empty");
            return;
        }

        try {
            new URL(endpoint);
            setTraefikEndpoint(endpoint);
            setSaved(true);
            toast.success("Traefik endpoint saved successfully");
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            toast.error("Invalid URL format");
        }
    };

    const handleReset = () => {
        const defaultEndpoint = "http://localhost:8080";
        setEndpoint(defaultEndpoint);
        setTraefikEndpoint(defaultEndpoint);
        toast.success("Reset to default endpoint");
    };

    return (
        <div className="min-h-screen -m-4 bg-[#f5f5f7] dark:bg-inherit w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 w-full">
                {/* Header */}
                <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                        <p className="text-sm">
                            Configure your Traefik dashboard preferences
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl bg-white dark:bg-inherit border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-medium">Traefik Endpoint</h2>
                        <p className="text-sm mt-1 text-muted-foreground">
                            Configure the URL where your Traefik is accessible
                        </p>
                    </div>

                    <div className="px-6 py-6 space-y-4">
                        <div>
                            <label htmlFor="endpoint" className="text-sm font-medium block mb-2">
                                API Endpoint URL
                            </label>
                            <Input
                                id="endpoint"
                                type="text"
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                                placeholder="http://localhost:8080"
                            />
                            <p className="text-xs mt-2 text-muted-foreground">
                                Example: http://localhost:8080 or https://traefik.example.com
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 overflow-hidden">
                            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                Note about API endpoints
                            </h3>
                            <p className="text-xs text-blue-800 dark:text-blue-400">
                                API endpoints will be proxied through the Next.js API to avoid CORS issues.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleSave} size="sm" disabled={saved}>
                                {saved ? "✓ Saved" : "Save Changes"}
                            </Button>
                            <Button onClick={handleReset} variant="outline" size="sm">
                                Reset to Default
                            </Button>
                        </div>
                    </div>
                </section>

                {/* API Status */}
                <section className="rounded-2xl bg-white dark:bg-inherit border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-medium">Connection Information</h2>
                        <p className="text-sm mt-1 text-muted-foreground">
                            Current configuration and connection status
                        </p>
                    </div>

                    <div className="px-6 py-6 space-y-3">
                        <div className="flex items-center justify-between gap-4 py-2 min-w-0">
                            <span className="text-sm shrink-0">
                                Current Endpoint
                            </span>
                            {isHydrated ? (
                                <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded truncate min-w-0 block">
                                    {traefikEndpoint}
                                </code>
                            ) : (
                                <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                    Loading...
                                </code>
                            )}
                        </div>
                        <div className="flex items-center justify-between gap-4 py-2">
                            <span className="text-sm shrink-0">
                                Connection Type
                            </span>
                            {isHydrated ? (
                                <span className="text-xs">
                                    {traefikEndpoint.includes("localhost") ||
                                        traefikEndpoint.includes("127.0.0.1") ||
                                        traefikEndpoint.includes(".local")
                                        ? "Direct (Browser)"
                                        : "Proxied (Server)"}
                                </span>
                            ) : (
                                <span className="text-xs">Loading...</span>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
