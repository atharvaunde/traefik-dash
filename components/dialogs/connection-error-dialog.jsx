"use client";
import Link from "next/link";
import { AlertTriangle, Settings, } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useTraefikStore from "@/lib/stores/traefik-store";

export function ConnectionErrorDialog({ open, onOpenChange }) {
    const { traefikEndpoint } = useTraefikStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full bg-destructive/10 p-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <DialogTitle>Cannot Connect to Traefik</DialogTitle>
                    </div>
                    <DialogDescription className="text-left space-y-3 pt-2">
                        <p>
                            Unable to reach the Traefik API. The dashboard is currently configured to connect to:
                        </p>
                        <div className="bg-muted rounded-lg p-3 font-mono text-sm break-all">
                            {traefikEndpoint}
                        </div>
                        <p className="text-xs">
                            Please verify that:
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside ml-2">
                            <li>Traefik is running and accessible</li>
                            <li>The endpoint URL is correct</li>
                            <li>API access is enabled in Traefik config</li>
                            <li>CORS is properly configured (if needed)</li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Dismiss
                    </Button>
                    <Button asChild>
                        <Link href="/settings" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Go to Settings
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
