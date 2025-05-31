import { cacheDataType, CacheProps } from '../types';
import { getExpiryTimeCacheKey } from '../utils/common.util';
import { FileMemory } from '../utils/cache.util';

const nodeCachedFetch = async (
    normalizedUrl: string,
    options: RequestInit,
    cacheOptions: CacheProps
): Promise<Response> => {

    const cacheKey = btoa(normalizedUrl);

    let response: Response | undefined;

    if (cacheOptions.strategy === 'cache-first') {
        if (FileMemory.has(cacheKey) && FileMemory.get(cacheKey)!.expiredAt > Date.now()) {
            response = FileMemory.get(cacheKey)!.response.clone();
        }
        else {
            const res = await fetch(normalizedUrl, options);
            const cacheData: cacheDataType = {
                response: res.clone(),
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            };
            FileMemory.set(cacheKey, cacheData);
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
            };
            FileMemory.set(cacheKey, cacheData);
            response = res;
        }
        catch (err) {
            if (FileMemory.has(cacheKey) && FileMemory.get(cacheKey)!.expiredAt > Date.now()) {
                response = FileMemory.get(cacheKey)!.response.clone();
            }
            else {
                throw new Error(`Network fetch failed and no cache available: ${err}`);
            }
        }
    }
    else if (cacheOptions.strategy === 'stale-while-revalidate') {
        if (FileMemory.has(cacheKey)) {
            response = FileMemory.get(cacheKey)!.response.clone();
        }
        fetch(normalizedUrl, options).
            then(res => FileMemory.set(cacheKey, {
                response: res,
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            })).catch(err => {
                console.warn('Background revalidation failed:', err);
            });
    }

    if (!response) {
        throw new Error('No valid response available.');
    }

    return response;
};

export default nodeCachedFetch;