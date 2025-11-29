import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";
import { toast } from "sonner";
import { isConnectionError } from "../utils/error-utils";
import { errorMap, httpErrorMessages } from "../ref-data";

//Use Next.js API proxy to avoid CORS issues
const BASE = "/traefik";
const traefikEndpoint = process.env.TRAEFIK_API_URL || "http://localhost:8080";

const useTraefikStore = create(
    persist(
        (set, get) => ({

            httpRouters: [],
            httpServices: [],
            httpMiddlewares: [],
            tcpRouters: [],
            tcpServices: [],
            tcpMiddlewares: [],
            udpRouters: [],
            udpServices: [],
            entrypoints: [],
            overview: null,
            rawData: null,
            version: null,
            latestRelease: null,
            traefikEndpoint: traefikEndpoint,

            loading: {},
            errors: {},
            connectionError: false,

            // Set custom Traefik endpoint
            setTraefikEndpoint: (endpoint) => {
                set({ traefikEndpoint: endpoint });
                if (typeof window !== "undefined") {
                    localStorage.setItem("traefikEndpoint", endpoint);
                }
            },

            setLoading: (k, v) =>
                set((s) => ({ loading: { ...s.loading, [k]: v } })),

            setError: (k, v) =>
                set((s) => ({ errors: { ...s.errors, [k]: v } })),

            call: async (key, req) => {
                const { traefikEndpoint } = get();

                set((s) => ({
                    loading: { ...s.loading, [key]: true },
                    errors: { ...s.errors, [key]: null },
                }));

                try {
                    const res = await req();
                    set({ [key]: res.data, connectionError: false });
                    return res.data;
                } catch (err) {
                    const msg = err.response?.data?.message || err.message || "Failed to fetch data";
                    const status = err.response?.status;
                    const responseData = err.response?.data;

                    // First check if the API route explicitly flagged this as a connection error
                    const isNetworkError =
                        responseData?.connectionError === true ||
                        status === 503 ||
                        isConnectionError(err) ||
                        (!status && !responseData); // No status and no data usually means network/connection issue


                    const resourceName = httpErrorMessages[key] || key;

                    if (isNetworkError) {
                        set({ connectionError: true });
                    } else {
                        const map = errorMap(resourceName);
                        const entry = map[status] || map.default;

                        const title = entry.title(resourceName);
                        const description = typeof entry.description === "function"
                            ? entry.description(msg)
                            : entry.description;

                        toast.error(title, { description });
                    }


                    set((s) => ({
                        errors: { ...s.errors, [key]: msg },
                    }));
                    throw err;
                } finally {
                    set((s) => ({
                        loading: { ...s.loading, [key]: false },
                    }));
                }
            },

            fetchHttpRouters() {
                return get().call("httpRouters", () => api.get(`${BASE}?path=/api/http/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchHttpServices() {
                return get().call("httpServices", () => api.get(`${BASE}?path=/api/http/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchHttpMiddlewares() {
                return get().call("httpMiddlewares", () => api.get(`${BASE}?path=/api/http/middlewares&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpRouters() {
                return get().call("tcpRouters", () => api.get(`${BASE}?path=/api/tcp/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpServices() {
                return get().call("tcpServices", () => api.get(`${BASE}?path=/api/tcp/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpMiddlewares() {
                return get().call("tcpMiddlewares", () => api.get(`${BASE}?path=/api/tcp/middlewares&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchUdpRouters() {
                return get().call("udpRouters", () => api.get(`${BASE}?path=/api/udp/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchUdpServices() {
                return get().call("udpServices", () => api.get(`${BASE}?path=/api/udp/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchEntrypoints() {
                return get().call("entrypoints", () => api.get(`${BASE}?path=/api/entrypoints&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchOverview() {
                return get().call("overview", () => api.get(`${BASE}?path=/api/overview&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchRawData() {
                return get().call("rawData", () => api.get(`${BASE}?path=/api/rawdata&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchVersion() {
                return get().call("version", () => api.get(`${BASE}?path=/api/version&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchLatestRelease: async () => {
                set((s) => ({
                    loading: { ...s.loading, latestRelease: true },
                    errors: { ...s.errors, latestRelease: null },
                }));

                try {
                    const res = await fetch(
                        "https://api.github.com/repos/traefik/traefik/releases/latest",
                        {
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                            },
                        }
                    );
                    set({ latestRelease: res.data });
                    return res.data;
                } catch (err) {
                    const msg = err.response?.data?.message || err.message || "Failed to fetch latest release";
                    toast.error("Failed to fetch latest Traefik release", {
                        description: msg
                    });
                    set((s) => ({
                        errors: { ...s.errors, latestRelease: msg },
                    }));
                    throw err;
                } finally {
                    set((s) => ({
                        loading: { ...s.loading, latestRelease: false },
                    }));
                }
            },

            fetchAll: async () => {
                const state = get();
                await Promise.allSettled([
                    state.fetchHttpRouters(),
                    state.fetchHttpServices(),
                    state.fetchHttpMiddlewares(),
                    state.fetchTcpRouters(),
                    state.fetchTcpServices(),
                    state.fetchTcpMiddlewares(),
                    state.fetchUdpRouters(),
                    state.fetchUdpServices(),
                    state.fetchEntrypoints(),
                    state.fetchOverview(),
                    state.fetchVersion(),
                    state.fetchLatestRelease(),
                ]);
            },

            clearConnectionError: () => {
                set({ connectionError: false });
            },

            clearAll: () => {
                set({
                    httpRouters: [],
                    httpServices: [],
                    httpMiddlewares: [],
                    tcpRouters: [],
                    tcpServices: [],
                    tcpMiddlewares: [],
                    udpRouters: [],
                    udpServices: [],
                    entrypoints: [],
                    overview: null,
                    rawData: null,
                    version: null,
                    latestRelease: null,
                    loading: {},
                    errors: {},
                    connectionError: false,
                });
            },
        }),
        {
            name: "traefik-store",
            partialize: (state) => ({ traefikEndpoint: state.traefikEndpoint }),
        }
    )
);

export default useTraefikStore;