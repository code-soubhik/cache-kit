import { cacheDataType, CacheProps } from '../types';
import { cacheMemory } from '../utils/cache.util';
import { getExpiryTimeCacheKey } from '../utils/common.util';

const memoryCachedFetch = async (
    normalizedUrl: string,
    options: RequestInit,
    cacheOptions: CacheProps
): Promise<Response> => {
    const cacheKey = normalizedUrl;

    let response: Response | undefined;

    if (cacheOptions.strategy === 'cache-first') {
        if (cacheMemory.has(cacheKey) && cacheMemory.get(cacheKey)!.expiredAt > Date.now()) {
            response = cacheMemory.get(cacheKey)!.response.clone();
        }
        else {
            const res = await fetch(normalizedUrl, options);
            const cacheData: cacheDataType = {
                response: res.clone(),
                expiredAt: getExpiryTimeCacheKey(cacheOptions?.revalidate)
            };
            cacheMemory.set(cacheKey, cacheData);
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
            cacheMemory.set(cacheKey, cacheData);
            response = res;
        }
        catch (err) {
            if (cacheMemory.has(cacheKey) && cacheMemory.get(cacheKey)!.expiredAt > Date.now()) {
                response = cacheMemory.get(cacheKey)!.response.clone();
            }
            else {
                throw new Error(`Network fetch failed and no cache available: ${err}`);
            }
        }
    }
    else if (cacheOptions.strategy === 'stale-while-revalidate') {
        if (cacheMemory.has(cacheKey)) {
            response = cacheMemory.get(cacheKey)!.response.clone();
        }
        fetch(normalizedUrl, options).
            then(res => cacheMemory.set(cacheKey, {
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

export default memoryCachedFetch;