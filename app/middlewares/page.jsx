"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { NoData } from "@/components/layout/no-data";
import { middlewareInformation, middlewareIcons, middlewareColors } from "@/lib/ref-data";

export default function Page() {
    const { httpMiddlewares, tcpMiddlewares, fetchAll } = useTraefikStore();
    const [protocol, setProtocol] = useState("http");

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const currentMiddlewares = useMemo(() => {
        if (protocol === "http") return httpMiddlewares;
        if (protocol === "tcp") return tcpMiddlewares;
        return [];
    }, [httpMiddlewares, tcpMiddlewares, protocol]);

    // TODO: Refactor to separate components and use svg icons for middleware types
    const getMiddlewareIcon = (type) => {

        return middlewareIcons[type?.toLowerCase()] || "⚙️";
    };

    const getMiddlewareInfo = (type) => {
        return middlewareInformation[type?.toLowerCase()] || { purpose: "Middleware configuration", area: "General" };
    };

    const getTypeColor = (type) => {
        return (
            middlewareColors[type?.toLowerCase()] ||
            "bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
        );
    };

    return (
        <div className="min-h-screen -m-4 bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
                {/* Header */}
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Middlewares
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Request/response transformation and policies
                        </p>
                    </div>
                </section>

                {/* Protocol Tabs */}
                <section className="flex gap-2">
                    <Button
                        variant={protocol === "http" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProtocol("http")}
                    >
                        HTTP ({httpMiddlewares.length})
                    </Button>
                    <Button
                        variant={protocol === "tcp" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProtocol("tcp")}
                    >
                        TCP ({tcpMiddlewares.length})
                    </Button>
                </section>

                {/* Middlewares Grid */}
                <TooltipProvider>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentMiddlewares.length === 0 && (
                            <NoData
                                title="No Middlewares Found"
                                description="No middlewares are currently configured. Middlewares allow you to modify requests and responses."
                                actionLabel="Refresh"
                                onAction={fetchAll}
                            />
                        )}
                        {currentMiddlewares.map((middleware) => {
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
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] capitalize ${getTypeColor(
                                                                middleware.type
                                                            )}`}
                                                        >
                                                            {middleware.type}
                                                        </span>
                                                        <span
                                                            className={`inline-flex capitalize items-center rounded-full border px-2 py-0.5 text-[11px] ${middleware.status === "enabled"
                                                                ? "border-[#196127]/30 bg-[#196127]/10 text-[#196127]"
                                                                : "border-slate-300 bg-slate-100 text-slate-600"
                                                                }`}
                                                        >
                                                            {middleware.status}
                                                        </span>
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
                                        {/* Configuration Details */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium">
                                                Configuration
                                            </p>
                                            <div className="text-xs space-y-1 bg-slate-50 dark:bg-inherit rounded text-xs">
                                                {/* Rate Limit */}
                                                {middleware.rateLimit && (
                                                    <div className="px-3 py-2 rounded space-y-1">
                                                        <div>
                                                            <span className="font-medium">Average:</span>{" "}
                                                            {middleware.rateLimit.average} req/s
                                                        </div>
                                                        {middleware.rateLimit.burst && (
                                                            <div>
                                                                <span className="font-medium">Burst:</span>{" "}
                                                                {middleware.rateLimit.burst}
                                                            </div>
                                                        )}
                                                        {middleware.rateLimit.period && (
                                                            <div>
                                                                <span className="font-medium">Period:</span>{" "}
                                                                {middleware.rateLimit.period}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Basic Auth */}
                                                {middleware.basicAuth && (
                                                    <div className="px-3 py-2 rounded">
                                                        <div>
                                                            <span className="font-medium">Users:</span>{" "}
                                                            {middleware.basicAuth.users?.length || 0} configured
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Strip Prefix */}
                                                {middleware.stripPrefix && (
                                                    <div className="px-3 py-2 rounded">
                                                        <div>
                                                            <span className="font-medium">Prefixes:</span>
                                                        </div>
                                                        {middleware.stripPrefix.prefixes?.map((prefix, idx) => (
                                                            <code
                                                                key={idx}
                                                                className="block text-[11px] text-blue-600 dark:text-blue-400 mt-1"
                                                            >
                                                                {prefix}
                                                            </code>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Headers */}
                                                {middleware.headers && (
                                                    <div className="px-3 py-2 rounded space-y-1">
                                                        {middleware.headers.customRequestHeaders && (
                                                            <div>
                                                                <span className="font-medium">Request Headers:</span>{" "}
                                                                {Object.keys(middleware.headers.customRequestHeaders).length}
                                                            </div>
                                                        )}
                                                        {middleware.headers.customResponseHeaders && (
                                                            <div>
                                                                <span className="font-medium">Response Headers:</span>{" "}
                                                                {Object.keys(middleware.headers.customResponseHeaders).length}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Compress */}
                                                {middleware.compress && (
                                                    <div className="px-3 py-2 rounded">
                                                        {middleware.compress.encodings && (
                                                            <div>
                                                                <span className="font-medium">Encodings:</span>{" "}
                                                                {middleware.compress.encodings.join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Redirect Scheme */}
                                                {middleware.redirectScheme && (
                                                    <div className="px-3 py-2 rounded">
                                                        <div>
                                                            <span className="font-medium">Scheme:</span>{" "}
                                                            {middleware.redirectScheme.scheme}
                                                        </div>
                                                        {middleware.redirectScheme.permanent !== undefined && (
                                                            <div>
                                                                <span className="font-medium">Permanent:</span>{" "}
                                                                {middleware.redirectScheme.permanent ? "Yes" : "No"}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Redirect Regex */}
                                                {middleware.redirectRegex && (
                                                    <div className="px-3 py-2 rounded space-y-1">
                                                        <div>
                                                            <span className="font-medium">Regex:</span>
                                                            <code className="block text-[11px] mt-1">
                                                                {middleware.redirectRegex.regex}
                                                            </code>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Replacement:</span>
                                                            <code className="block text-[11px] mt-1">
                                                                {middleware.redirectRegex.replacement}
                                                            </code>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* IP Whitelist */}
                                                {middleware.ipWhiteList && (
                                                    <div className="px-3 py-2 rounded">
                                                        <div>
                                                            <span className="font-medium">Source Ranges:</span>
                                                        </div>
                                                        {middleware.ipWhiteList.sourceRange?.map((range, idx) => (
                                                            <code
                                                                key={idx}
                                                                className="block text-[11px] text-slate-600 dark:text-slate-400 mt-1"
                                                            >
                                                                {range}
                                                            </code>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Used By */}
                                        {middleware.usedBy && middleware.usedBy.length > 0 && (
                                            <div className="pt-3 border-t">
                                                <p className="text-xs font-medium mb-2">
                                                    Used By ({middleware.usedBy.length})
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {middleware.usedBy.slice(0, 3).map((router, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center text-[11px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"
                                                        >
                                                            {router}
                                                        </span>
                                                    ))}
                                                    {middleware.usedBy.length > 3 && (
                                                        <span className="inline-flex items-center text-[11px]">
                                                            +{middleware.usedBy.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </TooltipProvider>
            </div>
        </div>
    );
}