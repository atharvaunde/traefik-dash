"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import useTraefikStore from "@/lib/stores/traefik-store";
import { Button } from "@/components/ui/button";
import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { StatCards } from "@/components/layout/stat-cards";

export default function Page() {
  const {
    httpRouters,
    tcpRouters,
    entrypoints,
    overview,
    version,
    fetchAll,
  } = useTraefikStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const summary = useMemo(() => {
    const totalRouters = (overview?.http?.routers?.total || 0) +
      (overview?.tcp?.routers?.total || 0) +
      (overview?.udp?.routers?.total || 0);
    const totalServices = (overview?.http?.services?.total || 0) +
      (overview?.tcp?.services?.total || 0) +
      (overview?.udp?.services?.total || 0);
    const totalMiddlewares = (overview?.http?.middlewares?.total || 0) +
      (overview?.tcp?.middlewares?.total || 0);

    const enabledRouters = httpRouters.filter(r => r.status === "enabled").length +
      tcpRouters.filter(r => r.status === "enabled").length;
    const errorRouters = overview?.http?.routers?.errors || 0;
    const warningRouters = overview?.http?.routers?.warnings || 0;

    return {
      totalRouters,
      totalServices,
      totalMiddlewares,
      totalEntrypoints: entrypoints.length,
      enabledRouters,
      errorRouters,
      warningRouters,
      httpRoutersCount: overview?.http?.routers?.total || 0,
      tcpRoutersCount: overview?.tcp?.routers?.total || 0,
      udpRoutersCount: overview?.udp?.routers?.total || 0,
    };
  }, [overview, httpRouters, tcpRouters, entrypoints]);

  const recentRouters = useMemo(() => {
    return [...httpRouters]
      .filter(r => r.status === "enabled")
      .slice(0, 5);
  }, [httpRouters]);

  const routersWithErrors = useMemo(() => {
    return httpRouters.filter(r => r.error && r.error.length > 0).slice(0, 5);
  }, [httpRouters]);

  const getStatusColor = (status) => {
    return status === "enabled"
      ? "border-[#196127]/30 bg-[#196127]/10 text-[#196127]"
      : "border-red-500/30 bg-red-500/10 text-red-600";
  };

  const chartData = useMemo(() => {
    const data = [];

    if (summary.enabledRouters > 0) {
      data.push({
        status: "Healthy",
        count: summary.enabledRouters,
        fill: "hsl(142, 76%, 36%)",
      });
    }

    if (summary.errorRouters > 0) {
      data.push({
        status: "Unhealthy",
        count: summary.errorRouters,
        fill: "hsl(0, 84%, 60%)",
      });
    }

    if (summary.warningRouters > 0) {
      data.push({
        status: "Warnings",
        count: summary.warningRouters,
        fill: "hsl(38, 92%, 50%)",
      });
    }

    const disabledRouters = summary.totalRouters - summary.enabledRouters - summary.errorRouters - summary.warningRouters;
    if (disabledRouters > 0) {
      data.push({
        status: "Disabled",
        count: disabledRouters,
        fill: "hsl(215, 16%, 47%)",
      });
    }

    return data;
  }, [summary]);

  const chartConfig = {
    count: {
      label: "Routers",
    },
    Healthy: {
      label: "Healthy",
      color: "hsl(142, 76%, 36%)",
    },
    Unhealthy: {
      label: "Unhealthy",
      color: "hsl(0, 84%, 60%)",
    },
    Warnings: {
      label: "Warnings",
      color: "hsl(38, 92%, 50%)",
    },
    Disabled: {
      label: "Disabled",
      color: "hsl(215, 16%, 47%)",
    },
  }

  return (
    <div className="min-h-screen  bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Traefik Dashboard
            </h1>
            <p className="text-sm">
              Monitor routers, services, middlewares & entrypoints · {" "}
              <span className="font-medium">
                {version?.Version || "Loading..."} ({version?.Codename || ""})
              </span>
            </p>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCards stats={{
            label: "Total Routers",
            number: summary.totalRouters,
            description: "HTTP · TCP · UDP routes"
          }} />

          <StatCards stats={{
            label: "Total Services",
            number: summary.totalServices,
            description: "Backend services configured"
          }} />

          <StatCards stats={{
            label: "Middlewares",
            number: summary.totalMiddlewares,
            description: "Active middleware chains"
          }} />

          <StatCards stats={{
            label: "Entrypoints",
            number: summary.totalEntrypoints,
            description: "Listening on ports"
          }} />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white dark:bg-inherit shadow-none">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Health Status</p>
              <p className="text-xs">Router health distribution</p>
            </div>
            <div className="px-5 py-5 space-y-4">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}

                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-inherit shadow-none">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Active HTTP Routers</p>
                <p className="text-xs">Recently configured routes</p>
              </div>
              <Link href="/routers">
                <Button variant="outline" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </div>
            <div className="px-5 py-3">
              <ul className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                {recentRouters.length === 0 && (
                  <p className="text-xs py-2">No routers found.</p>
                )}
                {recentRouters.map((router) => (
                  <li key={router.name} className="py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{router.name}</p>
                        <p className="text-[11px]">{router.rule}</p>
                        <p className="text-[11px]">
                          Service: {router.service} · Provider: {router.provider}
                        </p>
                      </div>
                      <span
                        className={`inline-flex capitalize items-center rounded-full border px-2 py-0.5 text-[11px] ${getStatusColor(router.status)}`}
                      >
                        {router.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-inherit shadow-none">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Routers with Errors</p>
              <p className="text-xs">Requires attention</p>
            </div>
            <div className="px-5 py-3">
              <ul className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                {routersWithErrors.length === 0 && (
                  <p className="text-xs text-emerald-600 py-2">✓ All routers are healthy!</p>
                )}
                {routersWithErrors.map((router) => (
                  <li key={router.name} className="py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{router.name}</p>
                        <p className="text-[11px]">{router.rule}</p>
                        {router.error && (
                          <p className="mt-1 text-[11px] text-red-600">• {router.error.join(" · ")}</p>
                        )}
                      </div>
                      <span className="inline-flex capitalize items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-600 px-2 py-0.5 text-[11px]">
                        {router.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}