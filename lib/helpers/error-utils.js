export function isConnectionError(error) {
    return (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNRESET' ||
        error.cause?.code === 'ECONNREFUSED' ||
        error.cause?.code === 'ETIMEDOUT' ||
        error.cause?.code === 'ENOTFOUND' ||
        error.cause?.code === 'ECONNRESET' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('fetch failed') ||
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('connect ECONNREFUSED')
    );
}
