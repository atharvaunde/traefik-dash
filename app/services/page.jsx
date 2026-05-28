"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartIcon, Search, Copy, Check } from "lucide-react";
import { NoData } from "@/components/layout/no-data";
import { StatusBadge } from "@/components/layout/status-badge";
import { ProtocolTabs } from "@/components/layout/protocol-tabs";
import { SkeletonCard } from "@/components/layout/skeleton-card";
import { toast } from "sonner";
import { PageRefresh } from "@/components/layout/page-refresh";

const PAGE_SIZE = 12;

export default function Page() {
    const { httpServices, tcpServices, udpServices, fetchAll, loading } = useTraefikStore();
    const [protocol, setProtocol] = useState("http");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [copiedUrl, setCopiedUrl] = useState(null);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, protocol]);

    const isLoading = loading.httpServices || loading.tcpServices || loading.udpServices;

    const protocols = [
        { key: "http", label: "HTTP", count: httpServices.length },
        { key: "tcp", label: "TCP", count: tcpServices.length },
        { key: "udp", label: "UDP", count: udpServices.length },
    ];

    const currentServices = useMemo(() => {
        let services = [];
        if (protocol === "http") services = httpServices;
        if (protocol === "tcp") services = tcpServices;
        if (protocol === "udp") services = udpServices;

        if (searchQuery.length >= 2) {
            const q = searchQuery.toLowerCase();
            services = services.filter((s) =>
                s.name?.toLowerCase().includes(q) ||
                s.provider?.toLowerCase().includes(q) ||
                s.type?.toLowerCase().includes(q)
            );
        }

        return services;
    }, [httpServices, tcpServices, udpServices, protocol, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(currentServices.length / PAGE_SIZE));
    const paginatedServices = currentServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const getServerStatus = (service) => {
        if (!service.serverStatus) return null;
        const servers = Object.entries(service.serverStatus);
        const upServers = servers.filter(([_, status]) => status === "UP").length;
        return { total: servers.length, up: upServers };
    };

    const copyUrl = async (url) => {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        toast.success("Copied");
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <div className="bg-background w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 pb-20 md:pb-8">
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
                        <p className="text-sm text-muted-foreground">
                            Backend services and load balancers
                        </p>
                    </div>
                    <PageRefresh />
                </section>

                <section className="flex flex-col md:flex-row md:items-center gap-3">
                    <ProtocolTabs protocols={protocols} active={protocol} onChange={setProtocol} />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            {paginatedServices.length === 0 && (
                                <NoData
                                    title="No Services Found"
                                    description="No services match your current filters."
                                    actionLabel="Refresh"
                                    onAction={() => fetchAll(true)}
                                />
                            )}
                            {paginatedServices.map((service) => {
                                const serverStatus = getServerStatus(service);
                                return (
                                    <div
                                        key={service.name}
                                        className="rounded-2xl bg-white dark:bg-inherit border transition"
                                    >
                                        <div className="px-5 pt-4 pb-3 border-b">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-sm font-medium truncate">
                                                    {service.name}
                                                </h3>
                                                <span>
                                                    {service?.loadBalancer?.healthCheck ? (
                                                        <HeartIcon className="w-4 h-4 text-emerald-500" />
                                                    ) : null}
                                                </span>
                                                <StatusBadge status={service.status} />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="capitalize">{service.provider}</span>
                                                {service.type && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="capitalize">{service.type}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-5 py-4 space-y-3">
                                            {service.loadBalancer && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium">Load Balancer</p>
                                                    <div className="text-xs space-y-1">
                                                        {service.loadBalancer.strategy && (
                                                            <div>
                                                                <span className="font-medium">Strategy:</span>{" "}
                                                                {service.loadBalancer.strategy.toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="font-medium">Servers:</span>{" "}
                                                            {service.loadBalancer.servers?.length || 0}
                                                        </div>
                                                        {service.loadBalancer.passHostHeader !== undefined && (
                                                            <div>
                                                                <span className="font-medium">Pass Host Header:</span>{" "}
                                                                {service.loadBalancer.passHostHeader ? "Yes" : "No"}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {service.loadBalancer.servers && service.loadBalancer.servers.length > 0 && (
                                                        <div className="mt-3 space-y-1">
                                                            <p className="text-xs font-medium">Backend Servers</p>
                                                            {service.loadBalancer.servers.map((server, idx) => {
                                                                const url = server.url || server.address;
                                                                const status = service.serverStatus?.[url];
                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900 px-2 py-1.5 rounded"
                                                                    >
                                                                        <code className="truncate">{url}</code>
                                                                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                                            {status && (
                                                                                <span className={status === "UP" ? "text-emerald-600" : "text-red-600"}>
                                                                                    {status}
                                                                                </span>
                                                                            )}
                                                                            {url && (
                                                                                <button
                                                                                    onClick={() => copyUrl(url)}
                                                                                    className="p-0.5 rounded text-muted-foreground hover:text-foreground transition"
                                                                                >
                                                                                    {copiedUrl === url ? (
                                                                                        <Check className="h-3 w-3 text-emerald-600" />
                                                                                    ) : (
                                                                                        <Copy className="h-3 w-3" />
                                                                                    )}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {serverStatus && (
                                                <div className="pt-3 border-t">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span>Server Health</span>
                                                        <span className={`font-semibold ${serverStatus.up === serverStatus.total ? "text-emerald-600" : "text-amber-600"}`}>
                                                            {serverStatus.up}/{serverStatus.total} UP
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 w-full h-1.5 rounded-full dark:bg-slate-700 overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500"
                                                            style={{ width: `${(serverStatus.up / serverStatus.total) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {service.usedBy && service.usedBy.length > 0 && (
                                                <div className="pt-3 border-t">
                                                    <p className="text-xs font-medium mb-2">
                                                        Used By ({service.usedBy.length})
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {service.usedBy.slice(0, 3).map((router, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center text-xs dark:bg-slate-700 px-2 py-0.5 rounded"
                                                            >
                                                                {router}
                                                            </span>
                                                        ))}
                                                        {service.usedBy.length > 3 && (
                                                            <span className="inline-flex items-center text-xs">
                                                                +{service.usedBy.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </section>
                {!isLoading && currentServices.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, currentServices.length)} of {currentServices.length}
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
            </div>
        </div>
    );
}
