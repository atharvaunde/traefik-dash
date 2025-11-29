import { Database, RefreshCw, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoData({
    title = "No Data Found",
    description = "There are no items to display at the moment.",
    action,
    actionLabel = "Refresh",
    onAction,
    icon: CustomIcon
}) {
    const Icon = CustomIcon || Database;

    return (
        <div className="col-span-full rounded-2xl bg-white dark:bg-inherit border overflow-hidden">


            {/* Content */}
            <div className="relative p-12 text-center">
                <div className="mx-auto max-w-md space-y-5">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="relative rounded-full p-6 border border-primary/10">
                                <Icon className="w-10 h-10 text-primary/60" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {(action || onAction) && (
                        <div className="pt-2">
                            {action || (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 shadow-sm"
                                    onClick={onAction}
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    {actionLabel}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Status indicator */}
                    <div className="pt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground font-mono">
                            <Network className="w-3 h-3" />
                            <span>NO_ENTRIES</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
