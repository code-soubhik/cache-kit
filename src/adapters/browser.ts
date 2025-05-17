import { cacheDataType, CacheProps } from '../types';
import { getExpiryTimeCacheKey } from "../utils/common";

const BrowserMemory = {
    set: async function (key: string, data: cacheDataType): Promise<void> {
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
    get: function (key: string) {
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
    has: function (key: string) {
        return localStorage.getItem(key) !== null;
    }
}

export const browserCachedFetch = async (
    normalizedUrl: string,
    options: RequestInit,
    cacheOptions: CacheProps
): Promise<Response> => {
    const cacheKey = normalizedUrl;

    let response: Response | undefined;

    if (cacheOptions.strategy === 'cache-first') {
        if (BrowserMemory.has(cacheKey) && BrowserMemory.get(cacheKey)!.expiredAt > Date.now()) {
            response = BrowserMemory.get(cacheKey)!.response.clone();
        }
        else {
            const res = await fetch(normalizedUrl, options);
            const cacheData: cacheDataType = {
                response: res.clone(),
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            }
            await BrowserMemory.set(cacheKey, cacheData);
            response = res;
        }
    }
    else if (cacheOptions.strategy === 'network-first') {
        let res: Response;
        try {
            res = await fetch(normalizedUrl, options);
            const cacheData: cacheDataType = {
                response: res.clone(),
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            }
            await BrowserMemory.set(cacheKey, cacheData);
            response = res;
        }
        catch (err) {
            if (BrowserMemory.has(cacheKey) && BrowserMemory.get(cacheKey)!.expiredAt > Date.now()) {
                response = BrowserMemory.get(cacheKey)!.response.clone();
            }
            else {
                throw new Error(`Network fetch failed and no cache available: ${err}`);
            }
        }
    }
    else if (cacheOptions.strategy === 'stale-while-revalidate') {
        if (BrowserMemory.has(cacheKey)) {
            response = BrowserMemory.get(cacheKey)!.response.clone();
        }
        fetch(normalizedUrl, options).
            then(res => BrowserMemory.set(cacheKey, {
                response: res,
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            })).catch(err => {
                console.warn("Background revalidation failed:", err);
            });
    }

    if (!response) {
        throw new Error("No valid response available.");
    }

    return response;
}