export function SkeletonList({ rows = 5 }) {
    return (
        <div className="divide-y">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse">
                    <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/3" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                        <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border animate-pulse">
            <div className="px-5 pt-4 pb-3 border-b space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
            </div>
            <div className="px-5 py-4 space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
            </div>
        </div>
    );
}

export function SkeletonStatCards({ count = 4 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border animate-pulse">
                    <div className="px-5 pt-4 pb-3 space-y-2">
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-8 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                </div>
            ))}
        </>
    );
}
