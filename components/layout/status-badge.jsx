import { cn } from "@/lib/utils";

const colorMap = {
    enabled: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    disabled: "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
    error: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function StatusBadge({ status, className }) {
    const color = colorMap[status] || colorMap.disabled;
    return (
        <span className={cn("inline-flex capitalize items-center rounded-full border px-2 py-0.5 text-xs", color, className)}>
            {status}
        </span>
    );
}
