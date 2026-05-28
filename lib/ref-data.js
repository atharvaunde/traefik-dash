const middlewareInformation = {
    basicauth: { purpose: "Basic auth mechanism", area: "Security, Authentication" },
    digestauth: { purpose: "Adds Digest Authentication", area: "Security, Authentication" },
    forwardauth: { purpose: "Authentication delegation", area: "Security, Authentication" },
    addprefix: { purpose: "Add a Path Prefix", area: "Path Modifier" },
    stripprefix: { purpose: "Change the path of the request", area: "Path Modifier" },
    stripprefixregex: { purpose: "Change the path of the request", area: "Path Modifier" },
    replacepath: { purpose: "Change the path of the request", area: "Path Modifier" },
    replacepathregex: { purpose: "Change the path of the request", area: "Path Modifier" },
    buffering: { purpose: "Buffers the request/response", area: "Request Lifecycle" },
    circuitbreaker: { purpose: "Stop calling unhealthy services", area: "Request Lifecycle" },
    errors: { purpose: "Define custom error pages", area: "Request Lifecycle" },
    inflightreq: { purpose: "Limit the number of simultaneous connections", area: "Security, Request lifecycle" },
    ratelimit: { purpose: "Limit the call frequency", area: "Security, Request lifecycle" },
    redirectscheme: { purpose: "Redirect easily the client elsewhere", area: "Request lifecycle" },
    redirectregex: { purpose: "Redirect the client elsewhere", area: "Request lifecycle" },
    retry: { purpose: "Automatically retry the request in case of errors", area: "Request lifecycle" },
    compress: { purpose: "Compress the response", area: "Content Modifier" },
    headers: { purpose: "Add / Update headers", area: "Security" },
    passtlsclientcert: { purpose: "Adding Client Certificates in a Header", area: "Security" },
    ipwhitelist: { purpose: "Limit the allowed client IPs", area: "Security, Request lifecycle" },
    ipallowlist: { purpose: "Limit the allowed client IPs", area: "Security, Request lifecycle" },
    chain: { purpose: "Combine multiple pieces of middleware", area: "Middleware tool" },
};

const middlewareIcons = {
    basicauth: "🔐",
    digestauth: "🔑",
    forwardauth: "🎫",
    addprefix: "➕",
    stripprefix: "✂️",
    stripprefixregex: "✂️",
    replacepath: "🔀",
    replacepathregex: "🔁",
    buffering: "💾",
    circuitbreaker: "🔌",
    errors: "❌",
    inflightreq: "🚦",
    ratelimit: "⏱️",
    redirectscheme: "↪️",
    redirectregex: "🔄",
    retry: "🔄",
    compress: "📦",
    headers: "📋",
    passtlsclientcert: "📜",
    ipwhitelist: "🛡️",
    ipallowlist: "✅",
    chain: "⛓️",
};

const middlewareColors = {
    basicauth: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    digestauth: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    forwardauth: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    addprefix: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    stripprefix: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    stripprefixregex: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    replacepath: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
    replacepathregex: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
    buffering: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    circuitbreaker: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    errors: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    inflightreq: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    ratelimit: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    redirectscheme: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
    redirectregex: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
    retry: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    compress: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    headers: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    passtlsclientcert: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
    ipwhitelist: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    ipallowlist: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    chain: "bg-slate-50 text-slate-700 border-slate-200 dark:text-slate-300 dark:border-slate-700",
};

const httpErrorMessages = {
    httpRouters: "HTTP Routers",
    httpServices: "HTTP Services",
    httpMiddlewares: "HTTP Middlewares",
    tcpRouters: "TCP Routers",
    tcpServices: "TCP Services",
    tcpMiddlewares: "TCP Middlewares",
    udpRouters: "UDP Routers",
    udpServices: "UDP Services",
    entrypoints: "Entry Points",
    overview: "Overview Data",
    version: "Traefik Version",
};

const errorMap = (resource) => ({
    404: {
        title: (resource) => `${resource} Not Found`,
        description: "This API endpoint may not be available in your Traefik version"
    },
    401: {
        title: () => "Authentication Required",
        description: "API access requires authentication. Check your Traefik configuration."
    },
    403: {
        title: () => "Access Denied",
        description: "You don't have permission to access this resource"
    },
    500: {
        title: () => "Server Error",
        description: (resource) => `Traefik encountered an error processing ${resource}`
    },
    503: {
        title: () => "Service Unavailable",
        description: "Traefik API is temporarily unavailable"
    },
    default: {
        title: (resource) => `Failed to Load ${resource}`,
        description: (msg) => msg
    }
});



export { middlewareInformation, middlewareIcons, middlewareColors, httpErrorMessages, errorMap };