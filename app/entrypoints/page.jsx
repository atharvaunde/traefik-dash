"use client";

import { useEffect, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { StatCards } from "@/components/layout/stat-cards";

export default function Page() {
    const { entrypoints, fetchAll } = useTraefikStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const sortedEntrypoints = useMemo(() => {
        return Object.entries(entrypoints || {})
            .map(([name, config]) => ({ name, ...config }))
            .sort((a, b) => {
                const portA = parseInt(a.address?.split(":").pop()) || 0;
                const portB = parseInt(b.address?.split(":").pop()) || 0;
                return portA - portB;
            });
    }, [entrypoints]);

    const getProtocolIcon = (address) => {
        if (!address) return "🌐";
        if (address.includes("/udp")) return "📡";
        return "🔌";
    };

    const getProtocolColor = (address) => {
        if (!address) return "bg-slate-50 border-slate-200";
        if (address.includes("/udp"))
            return "bg-purple-50 text-purple-700 border-purple-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    const parseAddress = (address) => {
        if (!address) return { port: "—", protocol: "TCP" };
        const parts = address.split("/");
        const portPart = parts[0]?.split(":").pop() || "—";
        const protocol = parts[1]?.toUpperCase() || "TCP";
        return { port: portPart, protocol };
    };

    return (
        <div className="min-h-screen -m-4 bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
                {/* Header */}
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Entry Points
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Network listeners and connection configuration
                        </p>
                    </div>
                </section>
                {/* Stats Bar */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCards stats={{
                        label: "Total Entrypoints",
                        number: sortedEntrypoints.length,
                        description: "All configured listeners"
                    }} />
                    <StatCards stats={{
                        label: "TCP Listeners",
                        number: sortedEntrypoints.filter((e) => !e.address?.includes("/udp")).length,
                        description: "Listeners using TCP protocol"
                    }} />
                    <StatCards stats={{
                        label: "UDP Listeners",
                        number: sortedEntrypoints.filter((e) => e.address?.includes("/udp")).length,
                        description: "Listeners using UDP protocol"
                    }} />
                    <StatCards stats={{
                        label: "HTTP Enabled",
                        number: sortedEntrypoints.filter((e) => e.http).length,
                        description: "Entrypoints with HTTP enabled"
                    }} />
                </section>

                {/* Entrypoints Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedEntrypoints.length === 0 && (
                        <div className="col-span-full rounded-2xl bg-white dark:bg-inherit border p-8 text-center text-sm">
                            No entrypoints found
                        </div>
                    )}
                    {sortedEntrypoints.map((entrypoint) => {
                        const { port, protocol } = parseAddress(entrypoint.address);
                        return (
                            <div
                                key={entrypoint.name}
                                className="rounded-2xl bg-white dark:bg-inherit border shadow-none transition"
                            >
                                {/* Header */}
                                <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex items-start gap-3 mb-2">
                                        <span className="text-2xl">{getProtocolIcon(entrypoint.address)}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium truncate">
                                                {entrypoint.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${getProtocolColor(
                                                        entrypoint.address
                                                    )}`}
                                                >
                                                    {protocol}
                                                </span>
                                                <span className="text-xs">Port {port}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Configuration */}
                                <div className="px-5 py-4 space-y-3">
                                    {/* HTTP Configuration */}
                                    {entrypoint.http && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                HTTP Configuration
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs space-y-1">
                                                {entrypoint.http.redirections?.entryPoint && (
                                                    <div>
                                                        <span className="font-medium">Redirect To:</span>{" "}
                                                        {entrypoint.http.redirections.entryPoint.to}
                                                        {entrypoint.http.redirections.entryPoint.scheme && (
                                                            <span>
                                                                {" "}
                                                                ({entrypoint.http.redirections.entryPoint.scheme})
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {entrypoint.http.tls && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="font-medium">TLS Enabled</span>
                                                    </div>
                                                )}
                                                {entrypoint.http.middlewares && (
                                                    <div>
                                                        <span className="font-medium">Middlewares:</span>{" "}
                                                        {entrypoint.http.middlewares.length}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Transport */}
                                    {entrypoint.transport && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                Transport
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs space-y-1">
                                                {entrypoint.transport.lifeCycle && (
                                                    <>
                                                        {entrypoint.transport.lifeCycle.requestAcceptGraceTimeout && (
                                                            <div>
                                                                <span className="font-medium">Request Accept Grace:</span>{" "}
                                                                {entrypoint.transport.lifeCycle.requestAcceptGraceTimeout}
                                                            </div>
                                                        )}
                                                        {entrypoint.transport.lifeCycle.graceTimeOut && (
                                                            <div>
                                                                <span className="font-medium">Grace Timeout:</span>{" "}
                                                                {entrypoint.transport.lifeCycle.graceTimeOut}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {entrypoint.transport.respondingTimeouts && (
                                                    <>
                                                        {entrypoint.transport.respondingTimeouts.readTimeout && (
                                                            <div>
                                                                <span className="font-medium">Read Timeout:</span>{" "}
                                                                {entrypoint.transport.respondingTimeouts.readTimeout}
                                                            </div>
                                                        )}
                                                        {entrypoint.transport.respondingTimeouts.writeTimeout && (
                                                            <div>
                                                                <span className="font-medium">Write Timeout:</span>{" "}
                                                                {entrypoint.transport.respondingTimeouts.writeTimeout}
                                                            </div>
                                                        )}
                                                        {entrypoint.transport.respondingTimeouts.idleTimeout && (
                                                            <div>
                                                                <span className="font-medium">Idle Timeout:</span>{" "}
                                                                {entrypoint.transport.respondingTimeouts.idleTimeout}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* UDP Config */}
                                    {entrypoint.udp && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                UDP Configuration
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs">
                                                {entrypoint.udp.timeout && (
                                                    <div>
                                                        <span className="font-medium">Timeout:</span> {entrypoint.udp.timeout}
                                                    </div>
                                                )}
                                                {!entrypoint.udp.timeout && (
                                                    <div>Default configuration</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* HTTP2 */}
                                    {entrypoint.http2 !== undefined && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                HTTP/2
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs">
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full ${entrypoint.http2 ? "bg-green-500" : "bg-slate-400"
                                                            }`}
                                                    />
                                                    <span>{entrypoint.http2 ? "Enabled" : "Disabled"}</span>
                                                </div>
                                                {entrypoint.http2?.maxConcurrentStreams && (
                                                    <div className="mt-1">
                                                        <span className="font-medium">Max Concurrent Streams:</span>{" "}
                                                        {entrypoint.http2.maxConcurrentStreams}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* HTTP3 */}
                                    {entrypoint.http3 !== undefined && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                HTTP/3
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs">
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full ${entrypoint.http3 ? "bg-green-500" : "bg-slate-400"
                                                            }`}
                                                    />
                                                    <span>{entrypoint.http3 ? "Enabled" : "Disabled"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Proxy Protocol */}
                                    {entrypoint.proxyProtocol && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                Proxy Protocol
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs space-y-1">
                                                {entrypoint.proxyProtocol.trustedIPs && (
                                                    <div>
                                                        <span className="font-medium">Trusted IPs:</span>{" "}
                                                        {entrypoint.proxyProtocol.trustedIPs.length}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Forwarded Headers */}
                                    {entrypoint.forwardedHeaders && (
                                        <div>
                                            <p className="text-xs font-medium mb-2">
                                                Forwarded Headers
                                            </p>
                                            <div className="bg-slate-50 dark:bg-inherit px-3 py-2 rounded text-xs">
                                                {entrypoint.forwardedHeaders.trustedIPs && (
                                                    <div>
                                                        <span className="font-medium">Trusted IPs:</span>{" "}
                                                        {entrypoint.forwardedHeaders.trustedIPs.length}
                                                    </div>
                                                )}
                                                {entrypoint.forwardedHeaders.insecure && (
                                                    <div className="text-amber-600">
                                                        <span className="font-medium">⚠️ Insecure Mode Enabled</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}