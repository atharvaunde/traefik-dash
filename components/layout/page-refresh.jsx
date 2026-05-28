"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTraefikStore from "@/lib/stores/traefik-store";

export function PageRefresh() {
    const { fetchAll, loading } = useTraefikStore();
    const isLoading = Object.values(loading).some(Boolean);

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAll(true)}
            disabled={isLoading}
            className="gap-1.5"
        >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
        </Button>
    );
}
