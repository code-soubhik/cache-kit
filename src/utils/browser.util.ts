import { cacheDataType, cacheFunctionStructure } from '../types';
import { makeKey } from './common.util';

export const BrowserMemory: cacheFunctionStructure = {
    set: async function (_key: string, data: cacheDataType): Promise<void> {
        const key = makeKey(_key);
        const text = await data.response.clone().text();
        const resData = {
            responseBody: text,
            expiredAt: data.expiredAt,
            headers: Object.fromEntries(data.response.headers.entries()),
            status: data.response.status,
            statusText: data.response.statusText,
        };
        window.localStorage.setItem(key, JSON.stringify(resData));
    },
    get: function (_key: string): cacheDataType | null {
        const key = makeKey(_key);
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            const { responseBody, expiredAt, headers, status, statusText } = parsed;
            return {
                expiredAt,
                response: new Response(responseBody, {
                    headers,
                    status,
                    statusText,
                }),
            };
        } catch {
            return null;
        }
    },
    has: function (_key: string): boolean {
        const key = makeKey(_key);
        return localStorage.getItem(key) !== null;
    },
    delete: function (_key: string): void {
        const key = makeKey(_key);
        localStorage.removeItem(key);
    },
    clear: function (): void {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
            if (key.startsWith('__CACHE_KIT__::')) {
                localStorage.removeItem(key);
            }
        }
    }
};
