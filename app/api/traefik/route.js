import { NextResponse } from 'next/server';
import { isConnectionError } from '@/lib/utils/error-utils';

const DEFAULT_TRAEFIK_URL = process.env.TRAEFIK_API_URL || 'http://localhost:8080';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/api/overview';
    const endpoint = searchParams.get('endpoint') || DEFAULT_TRAEFIK_URL;

    try {
        const response = await fetch(`${endpoint}${path}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Traefik API error: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        const isNetworkError = isConnectionError(error);

        return NextResponse.json(
            {
                error: error.message,
                connectionError: isNetworkError,
                code: error.code || error.cause?.code
            },
            { status: isNetworkError ? 503 : 500 }
        );
    }
}
