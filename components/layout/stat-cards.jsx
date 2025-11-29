export function StatCards({ stats }) {
    return (
        <div className="rounded-2xl border bg-white dark:bg-inherit shadow-none">
            <div className="px-5 pt-4 pb-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{stats.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stats.number}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    {stats.description}
                </p>
            </div>
        </div>
    );
}