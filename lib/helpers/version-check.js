const VERSION_CHECK_KEY = "traefik_version_check";
const CHECK_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export function getStoredVersionCheck() {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(VERSION_CHECK_KEY);
        if (!stored) return null;

        const data = JSON.parse(stored);
        const now = Date.now();

        // Check if cache is still valid (within 6 hours)
        if (now - data.timestamp < CHECK_INTERVAL) {
            return data;
        }

        return null;
    } catch (error) {
        console.error("Error reading version check from localStorage:", error);
        return null;
    }
}

export function storeVersionCheck(data) {
    if (typeof window === "undefined") return;

    try {
        const versionData = {
            ...data,
            timestamp: Date.now(),
        };
        localStorage.setItem(VERSION_CHECK_KEY, JSON.stringify(versionData));
    } catch (error) {
        console.error("Error storing version check to localStorage:", error);
    }
}

export function clearVersionCheck() {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(VERSION_CHECK_KEY);
    } catch (error) {
        console.error("Error clearing version check from localStorage:", error);
    }
}

export async function checkForUpdates(currentVersion) {
    // Check cache first
    const cached = getStoredVersionCheck();
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(
            "https://api.github.com/repos/traefik/traefik/releases/latest",
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const release = await response.json();
        const latestVersion = release.tag_name?.replace(/^v/, "") || release.name;

        const result = {
            currentVersion: currentVersion || "unknown",
            latestVersion,
            updateAvailable: currentVersion && isVersionNewer(latestVersion, currentVersion),
            releaseUrl: release.html_url,
            releaseNotes: release.body,
            publishedAt: release.published_at,
            releaseName: release.name,
        };

        // Store in cache as Github has stupid rate limits on public APIS also
        storeVersionCheck(result);

        return result;
    } catch (error) {
        console.error("Error checking for updates:", error);
        return null;
    }
}

// Compare semantic versions
function isVersionNewer(latest, current) {
    if (!latest || !current) return false;

    const latestParts = latest.replace(/^v/, "").split(".").map(Number);
    const currentParts = current.replace(/^v/, "").split(".").map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
    }

    return false;
}

// Format time ago
export function formatTimeAgo(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    if (diffMs < 60_000) return `${Math.floor(diffMs / 1000)}s ago`;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
