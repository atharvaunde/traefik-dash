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
    const redirectToSettings = () => {
        onOpenChange(false);
        window.location.href = "/settings";
    };

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
                    <DialogDescription className="text-left pt-2">
                        Unable to reach the Traefik API. The dashboard is currently configured to connect to:
                    </DialogDescription>
                </DialogHeader>

                {/* Content outside DialogDescription to avoid nesting issues */}
                <div className="space-y-3 px-6">
                    <div className="bg-muted rounded-lg p-3 font-mono text-sm break-all">
                        {traefikEndpoint}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Please verify that:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-2">
                        <li>Traefik is running and accessible</li>
                        <li>The endpoint URL is correct</li>
                        <li>API access is enabled in Traefik config</li>
                        <li>CORS is properly configured (if needed)</li>
                    </ul>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Dismiss
                    </Button>
                    <Button onClick={redirectToSettings}>
                        <Settings className="w-4 h-4" />
                        Go to Settings

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
