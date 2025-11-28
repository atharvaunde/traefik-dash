"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const nextTheme =
        theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    const icon =
        theme === "light" ? (
            <Sun className="h-4 w-4" />
        ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
        ) : (
            <Monitor className="h-4 w-4" />
        );

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(nextTheme)}
        >
            {icon}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
