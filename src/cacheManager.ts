import { browserCachedFetch } from './adapters/browser';
import { memoryCachedFetch } from './adapters/memory';
import { nodeCachedFetch } from './adapters/node';
import { CacheProps } from './types';

export const cachedFetch = async (url: string, options: RequestInit, cacheOptions: CacheProps): Promise<ResponseInit> => {
    const methodName = options?.method?.toLowerCase();
    let response: ResponseInit;
    const normalizedUrl : string = new URL(url).href;
    if ((!methodName || methodName === "get") && !options?.body) {
        switch (cacheOptions.adapter) {
            case 'memory':
                response = await memoryCachedFetch(normalizedUrl , options, cacheOptions);
                break;
            case 'browser':
                response = await browserCachedFetch(normalizedUrl , options, cacheOptions);
                break;
            case 'node':
                response = await nodeCachedFetch(normalizedUrl , options, cacheOptions);
                break;
        }
    }
    else {
        // If the request is not a GET request or doesn't have a body, we can fetch it.
        response = await fetch(url, options);
    }
    return response;
}