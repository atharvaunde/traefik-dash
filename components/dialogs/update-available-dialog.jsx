"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Download, } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTimeAgo } from "@/lib/utils/version-check";
import { remark } from 'remark';
import html from 'remark-html';

export function UpdateAvailableDialog({ open, onOpenChange, versionData }) {
    const [processedNotes, setProcessedNotes] = useState("");

    useEffect(() => {
        async function processMarkdown() {
            if (!versionData?.releaseNotes) {
                setProcessedNotes("No release notes available.");
                return;
            }

            try {
                const processedContent = await remark()
                    .use(html)
                    .process(versionData.releaseNotes);
                setProcessedNotes(processedContent.toString());
            } catch (error) {
                console.error("Error processing markdown:", error);
                setProcessedNotes(versionData.releaseNotes);
            }
        }

        if (open && versionData) {
            processMarkdown();
        }
    }, [open, versionData]);

    if (!versionData) return null;

    const { currentVersion, latestVersion, releaseUrl, releaseNotes, publishedAt, releaseName } = versionData;



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay />
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Download className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle>Update Available</DialogTitle>
                    </div>
                    <DialogDescription className="text-left pt-2">
                        A new version of Traefik is available! Consider updating to get the latest features and security improvements.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 ">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">Current Version</div>
                            <div className="font-mono font-semibold text-sm">{currentVersion}</div>



                        </div>
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">Latest Version</div>
                            <div className="font-mono font-semibold text-sm text-primary">{latestVersion}
                                {publishedAt && (
                                    <div className="text-xs text-muted-foreground">
                                        Published {formatTimeAgo(publishedAt)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <div className="text-sm font-medium mb-2">Release Notes</div>
                        <div
                            className="bg-muted/50 rounded-lg p-3 text-xs prose prose-sm dark:prose-invert max-h-48 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: processedNotes }}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Remind Me Later
                    </Button>
                    <Button asChild>
                        <a
                            href={releaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                        >
                            View on GitHub
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
