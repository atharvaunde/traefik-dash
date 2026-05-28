"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Info, Search } from "lucide-react";
import { NoData } from "@/components/layout/no-data";
import { StatusBadge } from "@/components/layout/status-badge";
import { ProtocolTabs } from "@/components/layout/protocol-tabs";
import { SkeletonCard } from "@/components/layout/skeleton-card";
import { PageRefresh } from "@/components/layout/page-refresh";
import { middlewareInformation, middlewareIcons, middlewareColors } from "@/lib/ref-data";

export default function Page() {
    const { httpMiddlewares, tcpMiddlewares, fetchAll, loading } = useTraefikStore();
    const [protocol, setProtocol] = useState("http");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const isLoading = loading.httpMiddlewares || loading.tcpMiddlewares;

    const protocols = [
        { key: "http", label: "HTTP", count: httpMiddlewares.length },
        { key: "tcp", label: "TCP", count: tcpMiddlewares.length },
    ];

    const currentMiddlewares = useMemo(() => {
        let middlewares = [];
        if (protocol === "http") middlewares = httpMiddlewares;
        if (protocol === "tcp") middlewares = tcpMiddlewares;

        if (searchQuery.length >= 2) {
            const q = searchQuery.toLowerCase();
            middlewares = middlewares.filter((m) =>
                m.name?.toLowerCase().includes(q) ||
                m.type?.toLowerCase().includes(q) ||
                m.provider?.toLowerCase().includes(q)
            );
        }

        return middlewares;
    }, [httpMiddlewares, tcpMiddlewares, protocol, searchQuery]);

    const getMiddlewareIcon = (type) => middlewareIcons[type?.toLowerCase()] || "⚙️";

    const getMiddlewareInfo = (type) =>
        middlewareInformation[type?.toLowerCase()] || { purpose: "Middleware configuration", area: "General" };

    const getTypeColor = (type) =>
        middlewareColors[type?.toLowerCase()] ||
        "bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";

    return (
        <div className="bg-background w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 pb-20 md:pb-8">
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Middlewares</h1>
                        <p className="text-sm text-muted-foreground">
                            Request/response transformation and policies
                        </p>
                    </div>
                    <PageRefresh />
                </section>

                <section className="flex flex-col md:flex-row md:items-center gap-3">
                    <ProtocolTabs protocols={protocols} active={protocol} onChange={setProtocol} />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search middlewares..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </section>

                <TooltipProvider>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : currentMiddlewares.length === 0 ? (
                            <NoData
                                title="No Middlewares Found"
                                description="No middlewares match your current filters."
                                actionLabel="Refresh"
                                onAction={() => fetchAll(true)}
                            />
                        ) : (
                            currentMiddlewares.map((middleware) => {
                                const middlewareInfo = getMiddlewareInfo(middleware.type);
                                return (
                                    <div
                                        key={middleware.name}
                                        className="rounded-xl bg-white border dark:bg-inherit shadow-none transition"
                                    >
                                        <div className="px-5 pt-4 pb-3 border-b">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <span className="text-2xl">{getMiddlewareIcon(middleware.type)}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium truncate">
                                                            {middleware.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs capitalize ${getTypeColor(middleware.type)}`}>
                                                                {middleware.type}
                                                            </span>
                                                            <StatusBadge status={middleware.status} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button className="p-1 rounded transition">
                                                            <Info className="h-4 w-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="max-w-xs">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-sm">{middlewareInfo.purpose}</p>
                                                            <p className="text-xs">Area: {middlewareInfo.area}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        <div className="px-5 py-4 space-y-3">
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium">Configuration</p>
                                                <div className="text-xs space-y-1 bg-slate-50 dark:bg-inherit rounded">
                                                    {middleware.rateLimit && (
                                                        <div className="px-3 py-2 rounded space-y-1">
                                                            <div><span className="font-medium">Average:</span> {middleware.rateLimit.average} req/s</div>
                                                            {middleware.rateLimit.burst && <div><span className="font-medium">Burst:</span> {middleware.rateLimit.burst}</div>}
                                                            {middleware.rateLimit.period && <div><span className="font-medium">Period:</span> {middleware.rateLimit.period}</div>}
                                                        </div>
                                                    )}
                                                    {middleware.basicAuth && (
                                                        <div className="px-3 py-2 rounded">
                                                            <div><span className="font-medium">Users:</span> {middleware.basicAuth.users?.length || 0} configured</div>
                                                        </div>
                                                    )}
                                                    {middleware.stripPrefix && (
                                                        <div className="px-3 py-2 rounded">
                                                            <div><span className="font-medium">Prefixes:</span></div>
                                                            {middleware.stripPrefix.prefixes?.map((prefix, idx) => (
                                                                <code key={idx} className="block text-xs text-blue-600 dark:text-blue-400 mt-1">{prefix}</code>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {middleware.headers && (
                                                        <div className="px-3 py-2 rounded space-y-1">
                                                            {middleware.headers.customRequestHeaders && (
                                                                <div><span className="font-medium">Request Headers:</span> {Object.keys(middleware.headers.customRequestHeaders).length}</div>
                                                            )}
                                                            {middleware.headers.customResponseHeaders && (
                                                                <div><span className="font-medium">Response Headers:</span> {Object.keys(middleware.headers.customResponseHeaders).length}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {middleware.compress && (
                                                        <div className="px-3 py-2 rounded">
                                                            {middleware.compress.encodings && (
                                                                <div><span className="font-medium">Encodings:</span> {middleware.compress.encodings.join(", ")}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {middleware.redirectScheme && (
                                                        <div className="px-3 py-2 rounded">
                                                            <div><span className="font-medium">Scheme:</span> {middleware.redirectScheme.scheme}</div>
                                                            {middleware.redirectScheme.permanent !== undefined && (
                                                                <div><span className="font-medium">Permanent:</span> {middleware.redirectScheme.permanent ? "Yes" : "No"}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {middleware.redirectRegex && (
                                                        <div className="px-3 py-2 rounded space-y-1">
                                                            <div>
                                                                <span className="font-medium">Regex:</span>
                                                                <code className="block text-xs mt-1">{middleware.redirectRegex.regex}</code>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Replacement:</span>
                                                                <code className="block text-xs mt-1">{middleware.redirectRegex.replacement}</code>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {middleware.ipWhiteList && (
                                                        <div className="px-3 py-2 rounded">
                                                            <div><span className="font-medium">Source Ranges:</span></div>
                                                            {middleware.ipWhiteList.sourceRange?.map((range, idx) => (
                                                                <code key={idx} className="block text-xs text-slate-600 dark:text-slate-400 mt-1">{range}</code>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {middleware.usedBy && middleware.usedBy.length > 0 && (
                                                <div className="pt-3 border-t">
                                                    <p className="text-xs font-medium mb-2">
                                                        Used By ({middleware.usedBy.length})
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {middleware.usedBy.slice(0, 3).map((router, idx) => (
                                                            <span key={idx} className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                                                {router}
                                                            </span>
                                                        ))}
                                                        {middleware.usedBy.length > 3 && (
                                                            <span className="inline-flex items-center text-xs">
                                                                +{middleware.usedBy.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>
                </TooltipProvider>
            </div>
        </div>
    );
}
