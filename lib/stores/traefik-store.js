import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";
import { toast } from "sonner";
import { isConnectionError } from "../helpers/error-utils";
import { errorMap, httpErrorMessages } from "../ref-data";

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
            version: null,
            traefikEndpoint: traefikEndpoint,
            lastFetchedAt: null,
            autoRefreshInterval: 0,

            loading: {},
            errors: {},
            connectionError: false,

            setTraefikEndpoint: (endpoint) => {
                set({ traefikEndpoint: endpoint });
                if (typeof window !== "undefined") {
                    localStorage.setItem("traefikEndpoint", endpoint);
                }
            },

            setAutoRefreshInterval: (ms) => {
                set({ autoRefreshInterval: ms });
            },

            setLoading: (k, v) =>
                set((s) => ({ loading: { ...s.loading, [k]: v } })),

            setError: (k, v) =>
                set((s) => ({ errors: { ...s.errors, [k]: v } })),

            call: async (key, req) => {
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

                    const isNetworkError =
                        responseData?.connectionError === true ||
                        status === 503 ||
                        isConnectionError(err) ||
                        (!status && !responseData);

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

                    set((s) => ({ errors: { ...s.errors, [key]: msg } }));
                    throw err;
                } finally {
                    set((s) => ({ loading: { ...s.loading, [key]: false } }));
                }
            },

            fetchHttpRouters() {
                const { traefikEndpoint } = get();
                return get().call("httpRouters", () => api.get(`${BASE}?path=/api/http/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchHttpServices() {
                const { traefikEndpoint } = get();
                return get().call("httpServices", () => api.get(`${BASE}?path=/api/http/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchHttpMiddlewares() {
                const { traefikEndpoint } = get();
                return get().call("httpMiddlewares", () => api.get(`${BASE}?path=/api/http/middlewares&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpRouters() {
                const { traefikEndpoint } = get();
                return get().call("tcpRouters", () => api.get(`${BASE}?path=/api/tcp/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpServices() {
                const { traefikEndpoint } = get();
                return get().call("tcpServices", () => api.get(`${BASE}?path=/api/tcp/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchTcpMiddlewares() {
                const { traefikEndpoint } = get();
                return get().call("tcpMiddlewares", () => api.get(`${BASE}?path=/api/tcp/middlewares&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchUdpRouters() {
                const { traefikEndpoint } = get();
                return get().call("udpRouters", () => api.get(`${BASE}?path=/api/udp/routers&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchUdpServices() {
                const { traefikEndpoint } = get();
                return get().call("udpServices", () => api.get(`${BASE}?path=/api/udp/services&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchEntrypoints() {
                const { traefikEndpoint } = get();
                return get().call("entrypoints", () => api.get(`${BASE}?path=/api/entrypoints&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchOverview() {
                const { traefikEndpoint } = get();
                return get().call("overview", () => api.get(`${BASE}?path=/api/overview&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchVersion() {
                const { traefikEndpoint } = get();
                return get().call("version", () => api.get(`${BASE}?path=/api/version&endpoint=${encodeURIComponent(traefikEndpoint)}`));
            },

            fetchAll: async (force = false) => {
                const state = get();
                if (!force && state.lastFetchedAt && Date.now() - state.lastFetchedAt < 30_000) {
                    return;
                }
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
                ]);
                set({ lastFetchedAt: Date.now() });
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
                    version: null,
                    lastFetchedAt: null,
                    loading: {},
                    errors: {},
                    connectionError: false,
                });
            },
        }),
        {
            name: "traefik-store",
            partialize: (state) => ({
                traefikEndpoint: state.traefikEndpoint,
                autoRefreshInterval: state.autoRefreshInterval,
            }),
        }
    )
);

export default useTraefikStore;
