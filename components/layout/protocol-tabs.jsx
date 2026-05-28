import { Button } from "@/components/ui/button";

export function ProtocolTabs({ protocols, active, onChange }) {
    return (
        <div className="flex gap-2">
            {protocols.map(({ key, label, count }) => (
                <Button
                    key={key}
                    variant={active === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(key)}
                >
                    {label} ({count})
                </Button>
            ))}
        </div>
    );
}
