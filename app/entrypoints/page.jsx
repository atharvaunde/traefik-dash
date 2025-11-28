"use client";

export default function Page() {
    return (
        <div className="min-h-screen -m-4 bg-[#f5f5f7] dark:bg-[#0d0d0f] w-full">
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
                {/* Header */}
                <section className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Entry Points
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Network listeners and connection configuration
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}