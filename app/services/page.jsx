"use client";

import { useEffect, useState, useMemo } from "react";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { NoData } from "@/components/layout/no-data";

export default function Page() {
    const { httpServices, tcpServices, udpServices, fetchAll } = useTraefikStore();
    const [protocol, setProtocol] = useState("http");

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const currentServices = useMemo(() => {
        if (protocol === "http") return httpServices;
        if (protocol === "tcp") return tcpServices;
        if (protocol === "udp") return udpServices;
        return [];
    }, [httpServices, tcpServices, udpServices, protocol]);

    const getServerStatus = (service) => {
        if (!service.serverStatus) return null;
        const servers = Object.entries(service.serverStatus);
        const upServers = servers.filter(([_, status]) => status === "UP").length;
        return { total: servers.length, up: upServers };
    };

    return (
        <div className="min-h-screen  bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
                {/* Header */}
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
                        <p className="text-sm text-muted-foreground">
                            Backend services and load balancers
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
                        HTTP ({httpServices.length})
                    </Button>
                    <Button
                        variant={protocol === "tcp" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProtocol("tcp")}
                    >
                        TCP ({tcpServices.length})
                    </Button>
                    <Button
                        variant={protocol === "udp" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProtocol("udp")}
                    >
                        UDP ({udpServices.length})
                    </Button>
                </section>

                {/* Services Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentServices.length === 0 && (
                        <NoData
                            title="No Services Found"
                            description="No services are currently configured. Services define backend services and load balancers."
                            actionLabel="Refresh"
                            onAction={fetchAll}
                        />
                    )}
                    {currentServices.map((service) => {
                        const serverStatus = getServerStatus(service);
                        return (
                            <div
                                key={service.name}
                                className="rounded-2xl bg-white dark:bg-inherit border transition"
                            >
                                <div className="px-5 pt-4 pb-3 border-b  ">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-sm font-medium  truncate">
                                            {service.name}
                                        </h3>
                                        <span>
                                            {service?.loadBalancer?.healthCheck ? (
                                                <HeartIcon className="w-4 h-4 text-emerald-500" />
                                            ) : null}
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded-full border capitalize px-2 py-0.5 text-[11px] ${service.status === "enabled"
                                                ? "border-[#196127]/30 bg-[#196127]/10 text-[#196127]"
                                                : "border-slate-300  text-slate-600"
                                                }`}
                                        >
                                            {service.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs ">
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
                                    {/* Load Balancer Info */}
                                    {service.loadBalancer && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium">
                                                Load Balancer
                                            </p>
                                            <div className="text-xs  space-y-1">
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

                                            {/* Server URLs */}
                                            {service.loadBalancer.servers && service.loadBalancer.servers.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs font-medium">
                                                        Backend Servers
                                                    </p>
                                                    {service.loadBalancer.servers.map((server, idx) => {
                                                        const url = server.url || server.address;
                                                        const status = service.serverStatus?.[url];
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-900 px-2 py-1.5 rounded"
                                                            >
                                                                <code className=" truncate">
                                                                    {url}
                                                                </code>
                                                                {status && (
                                                                    <span
                                                                        className={`ml-2 flex-shrink-0 ${status === "UP"
                                                                            ? "text-emerald-600"
                                                                            : "text-red-600"
                                                                            }`}
                                                                    >
                                                                        {status}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Server Status Summary */}
                                    {serverStatus && (
                                        <div className="pt-3 border-t  ">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="">Server Health</span>
                                                <span
                                                    className={`font-semibold ${serverStatus.up === serverStatus.total
                                                        ? "text-emerald-600"
                                                        : "text-amber-600"
                                                        }`}
                                                >
                                                    {serverStatus.up}/{serverStatus.total} UP
                                                </span>
                                            </div>
                                            <div className="mt-2 w-full h-1.5 rounded-full  dark:bg-slate-700 overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500"
                                                    style={{
                                                        width: `${(serverStatus.up / serverStatus.total) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Used By */}
                                    {service.usedBy && service.usedBy.length > 0 && (
                                        <div className="pt-3 border-t  ">
                                            <p className="text-xs font-medium mb-2">
                                                Used By ({service.usedBy.length})
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {service.usedBy.slice(0, 3).map((router, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center text-[11px]  dark:bg-slate-700  px-2 py-0.5 rounded"
                                                    >
                                                        {router}
                                                    </span>
                                                ))}
                                                {service.usedBy.length > 3 && (
                                                    <span className="inline-flex items-center text-[11px] ">
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
                </section>
            </div>
        </div>
    );
}