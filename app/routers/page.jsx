"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoData } from "@/components/layout/no-data";
import { StatusBadge } from "@/components/layout/status-badge";
import { ProtocolTabs } from "@/components/layout/protocol-tabs";
import { SkeletonList } from "@/components/layout/skeleton-card";
import { Search, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { PageRefresh } from "@/components/layout/page-refresh";

const PAGE_SIZE = 25;

export default function Page() {
    const { httpRouters, tcpRouters, udpRouters, fetchAll, loading } = useTraefikStore();
    const [filter, setFilter] = useState("all");
    const [protocol, setProtocol] = useState("http");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [copiedRule, setCopiedRule] = useState(null);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, filter, protocol]);

    const isLoading = loading.httpRouters || loading.tcpRouters || loading.udpRouters;

    const protocols = [
        { key: "http", label: "HTTP", count: httpRouters.length },
        { key: "tcp", label: "TCP", count: tcpRouters.length },
        { key: "udp", label: "UDP", count: udpRouters.length },
    ];

    const currentRouters = useMemo(() => {
        let routers = [];
        if (protocol === "http") routers = httpRouters;
        else if (protocol === "tcp") routers = tcpRouters;
        else if (protocol === "udp") routers = udpRouters;

        if (filter === "enabled") routers = routers.filter((r) => r.status === "enabled");
        else if (filter === "disabled") routers = routers.filter((r) => r.status === "disabled");
        else if (filter === "errors") routers = routers.filter((r) => r.error && r.error.length > 0);

        if (searchQuery.length >= 2) {
            const q = searchQuery.toLowerCase();
            routers = routers.filter((r) =>
                r.name?.toLowerCase().includes(q) ||
                r.rule?.toLowerCase().includes(q) ||
                r.service?.toLowerCase().includes(q) ||
                r.provider?.toLowerCase().includes(q)
            );
        }

        return routers;
    }, [httpRouters, tcpRouters, udpRouters, filter, protocol, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(currentRouters.length / PAGE_SIZE));
    const paginatedRouters = currentRouters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const copyRule = async (rule) => {
        await navigator.clipboard.writeText(rule);
        setCopiedRule(rule);
        toast.success("Copied");
        setTimeout(() => setCopiedRule(null), 2000);
    };

    return (
        <div className="bg-background w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 pb-20 md:pb-8">
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Routers</h1>
                        <p className="text-sm text-muted-foreground">
                            Routing configurations
                        </p>
                    </div>
                    <PageRefresh />
                </section>

                <section className="flex flex-col md:flex-row md:items-center gap-3">
                    <ProtocolTabs protocols={protocols} active={protocol} onChange={setProtocol} />

                    <div className="hidden md:block h-6 w-px bg-border" />

                    <div className="flex gap-2">
                        {["all", "enabled", "disabled", "errors"].map((f) => (
                            <Button
                                key={f}
                                variant={filter === f ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(f)}
                                className="capitalize"
                            >
                                {f}
                            </Button>
                        ))}
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search routers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </section>

                <section className="rounded-xl bg-white dark:bg-inherit border">
                    <div className="px-5 pt-4 pb-3 border-b">
                        <p className="text-sm font-medium">
                            {protocol.toUpperCase()} Routers ({currentRouters.length})
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Filtered by: {filter === "all" ? "All routers" : filter}
                        </p>
                    </div>
                    {isLoading ? (
                        <SkeletonList rows={5} />
                    ) : (
                        <div className="divide-y">
                            {paginatedRouters.length === 0 && (
                                <NoData
                                    title="No Routers Found"
                                    description="No routers match your current filters."
                                    actionLabel="Refresh"
                                    onAction={() => fetchAll(true)}
                                />
                            )}
                            {paginatedRouters.map((router) => (
                                <div key={router.name} className="px-5 py-4 bg-white dark:bg-inherit shadow-none transition">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-sm font-medium truncate">
                                                    {router.name}
                                                </h3>
                                                <StatusBadge status={router.status} />
                                                {router.priority && (
                                                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                                                        Priority: {router.priority}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Rule:</span>
                                                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">
                                                        {router.rule}
                                                    </code>
                                                    {router.rule && (
                                                        <button
                                                            onClick={() => copyRule(router.rule)}
                                                            className="p-0.5 rounded text-muted-foreground hover:text-foreground transition"
                                                        >
                                                            {copiedRule === router.rule ? (
                                                                <Check className="h-3 w-3 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="h-3 w-3" />
                                                            )}
                                                        </button>
                                                    )}
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
                                                        <span>
                                                            {router.middlewares.map((m, i) => (
                                                                <span key={i} className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded mr-1 text-xs">
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
                    )}
                    {!isLoading && currentRouters.length > PAGE_SIZE && (
                        <div className="px-5 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, currentRouters.length)} of {currentRouters.length}
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                    Prev
                                </Button>
                                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
