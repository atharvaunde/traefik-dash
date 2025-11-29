"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";

export default function Page() {
    const { httpRouters, tcpRouters, udpRouters, fetchAll } = useTraefikStore();
    const [filter, setFilter] = useState("all");
    const [protocol, setProtocol] = useState("http");

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const currentRouters = useMemo(() => {
        let routers = [];
        if (protocol === "http") routers = httpRouters;
        else if (protocol === "tcp") routers = tcpRouters;
        else if (protocol === "udp") routers = udpRouters;

        if (filter === "enabled") {
            return routers.filter((r) => r.status === "enabled");
        } else if (filter === "disabled") {
            return routers.filter((r) => r.status === "disabled");
        } else if (filter === "errors") {
            return routers.filter((r) => r.error && r.error.length > 0);
        }
        return routers;
    }, [httpRouters, tcpRouters, udpRouters, filter, protocol]);

    const getStatusBadge = (status) => {
        return status === "enabled"
            ? "border-[#196127]/30 bg-[#196127]/10 text-[#196127]"
            : "border-red-500/30 bg-red-500/10 text-red-600";
    };

    return (
        <div className="min-h-screen -m-4 bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
                {/* Header */}
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Routers</h1>
                        <p className="text-sm text-muted-foreground">
                            Routing configurations
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="flex flex-wrap gap-2">
                    <div className="flex gap-2 border-r pr-4">
                        <Button
                            variant={protocol === "http" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setProtocol("http")}
                        >
                            HTTP ({httpRouters.length})
                        </Button>
                        <Button
                            variant={protocol === "tcp" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setProtocol("tcp")}
                        >
                            TCP ({tcpRouters.length})
                        </Button>
                        <Button
                            variant={protocol === "udp" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setProtocol("udp")}
                        >
                            UDP ({udpRouters.length})
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("all")}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === "enabled" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("enabled")}
                        >
                            Enabled
                        </Button>
                        <Button
                            variant={filter === "disabled" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("disabled")}
                        >
                            Disabled
                        </Button>
                        <Button
                            variant={filter === "errors" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("errors")}
                        >
                            Errors
                        </Button>
                    </div>
                </section>

                {/* Routers List */}
                <section className="rounded-xl bg-white dark:bg-inherit border">
                    <div className="px-5 pt-4 pb-3 border-b">
                        <p className="text-sm font-medium">
                            {protocol.toUpperCase()} Routers ({currentRouters.length})
                        </p>
                        <p className="text-xs">
                            Filtered by: {filter === "all" ? "All routers" : filter}
                        </p>
                    </div>
                    <div className="divide-y">
                        {currentRouters.length === 0 && (
                            <div className="px-5 py-8 text-center text-sm">
                                No routers found
                            </div>
                        )}
                        {currentRouters.map((router) => (
                            <div key={router.name} className="px-5 py-4 bg-white dark:bg-inherit shadow-none transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-sm font-medium truncate">
                                                {router.name}
                                            </h3>
                                            <span
                                                className={`inline-flex capitalize items-center rounded-full border px-2 py-0.5 text-[11px] ${getStatusBadge(router.status)}`}
                                            >
                                                {router.status}
                                            </span>
                                            {router.priority && (
                                                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
                                                    Priority: {router.priority}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Rule:</span>
                                                <code className="text-[11px px-1.5 py-0.5 rounded">
                                                    {router.rule}
                                                </code>
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                <span>
                                                    <span className="font-medium">Service:</span> {router.service}
                                                </span>
                                                <span>
                                                    <span className="font-medium">Provider:</span> {router.provider}
                                                </span>
                                                {router.entryPoints && router.entryPoints.length > 0 && (
                                                    <span>
                                                        <span className="font-medium">EntryPoints:</span> {router.entryPoints.join(", ")}
                                                    </span>
                                                )}
                                            </div>

                                            {router.middlewares && router.middlewares.length > 0 && (
                                                <div>
                                                    <span className="font-medium">Middlewares:</span>{" "}
                                                    <span className="text-[11px]">
                                                        {router.middlewares.map((m, i) => (
                                                            <span key={i} className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded mr-1">
                                                                {m}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}

                                            {router.error && router.error.length > 0 && (
                                                <div className="text-red-600 dark:text-red-400">
                                                    <span className="font-medium">⚠ Errors:</span> {router.error.join(" · ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}