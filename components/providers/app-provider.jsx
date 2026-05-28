"use client";

import { useState, useEffect, useRef } from "react";
import { ConnectionErrorDialog } from "@/components/dialogs/connection-error-dialog";
import { UpdateAvailableDialog } from "@/components/dialogs/update-available-dialog";
import useTraefikStore from "@/lib/stores/traefik-store";
import { checkForUpdates } from "@/lib/helpers/version-check";

export function AppProvider({ children }) {
    const { connectionError, version, clearConnectionError, autoRefreshInterval, fetchAll } = useTraefikStore();
    const [showConnectionError, setShowConnectionError] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [versionData, setVersionData] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (connectionError) {
            setShowConnectionError(true);
        }
    }, [connectionError]);

    const handleConnectionDialogClose = (open) => {
        setShowConnectionError(open);
        if (!open) {
            clearConnectionError();
        }
    };

    useEffect(() => {
        async function performVersionCheck() {
            if (!version?.Version) return;

            try {
                const updateInfo = await checkForUpdates(version.Version);
                if (updateInfo?.updateAvailable) {
                    setVersionData(updateInfo);
                    setShowUpdateDialog(true);
                }
            } catch (error) {
                console.error("Version check failed:", error);
            }
        }

        if (version?.Version) {
            performVersionCheck();
        }
    }, [version]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (autoRefreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchAll(true);
            }, autoRefreshInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoRefreshInterval, fetchAll]);

    return (
        <>
            {children}

            <ConnectionErrorDialog
                open={showConnectionError}
                onOpenChange={handleConnectionDialogClose}
            />

            <UpdateAvailableDialog
                open={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                versionData={versionData}
            />
        </>
    );
}
