"use client";

import { useState, useEffect } from "react";
import { ConnectionErrorDialog } from "@/components/dialogs/connection-error-dialog";
import { UpdateAvailableDialog } from "@/components/dialogs/update-available-dialog";
import useTraefikStore from "@/lib/stores/traefik-store";
import { checkForUpdates } from "@/lib/utils/version-check";

export function AppProvider({ children }) {
    const { connectionError, version, clearConnectionError } = useTraefikStore();
    const [showConnectionError, setShowConnectionError] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [versionData, setVersionData] = useState(null);

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

    // Check for updates on mount and when version changes
    useEffect(() => {
        async function performVersionCheck() {
            if (!version?.Version) return;

            try {
                const currentVersion = version.Version;
                const updateInfo = await checkForUpdates(currentVersion);

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
