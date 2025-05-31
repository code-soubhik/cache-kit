import { CacheProps } from './types';

export const cachedFetch = async (url: string, options: RequestInit, cacheOptions: CacheProps): Promise<ResponseInit> => {
    const methodName = options?.method?.toLowerCase();
    let response: ResponseInit;
    const normalizedUrl: string = new URL(url).href;
    try {
        if ((!methodName || methodName === 'get') && !options?.body) {
            switch (cacheOptions.adapter) {
                case 'memory': {
                    //Import memory adaptor here
                    const { default: memoryCachedFetch } = await import('./adapters/memory');
                    response = await memoryCachedFetch(normalizedUrl, options, cacheOptions);
                    break;
                }
                case 'browser': {
                    if (typeof window === 'undefined') {
                        throw new Error('Browser adapter cannot be used in a Node.js environment.');
                    }
                    //Import here
                    const { default: browserCachedFetch } = await import('./adapters/browser');
                    response = await browserCachedFetch(normalizedUrl, options, cacheOptions);
                    break;
                }
                case 'node': {
                    if (typeof window !== 'undefined') {
                        throw new Error('Node adapter cannot be used in the browser.');
                    }
                    //Import here
                    const { default: nodeCachedFetch } = await import('./adapters/node');
                    response = await nodeCachedFetch(normalizedUrl, options, cacheOptions);
                    break;
                }
                default:
                    throw new Error(`Unknown adapter: ${cacheOptions.adapter}`);
            }
        }
        else {
            // If the request is not a GET request or doesn't have a body, we can fetch it.
            response = await fetch(url, options);
        }
    } catch (error) {
        console.warn('⚠️ cachedFetch fallback due to error:', error);
        // Always fallback to a plain fetch in case of failure
        response =  await fetch(url, options);
    }
    return response;
};