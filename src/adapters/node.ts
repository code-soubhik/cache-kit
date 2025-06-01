// adapters/node.ts

import { CacheProps } from '../types';
import { getExpiryTimeCacheKey } from '../utils/common.util';
import { FileMemory } from '../utils/node.util';

let fileCache: FileMemory | null = null;

const nodeCachedFetch = async (
  normalizedUrl: string,
  options: RequestInit,
  cacheOptions: CacheProps
): Promise<Response> => {
  const cacheKey = btoa(normalizedUrl);

  // Initialize only once with user-defined cacheFolder
  if (!fileCache) {
    const folderName = cacheOptions?.folderName || 'cache-kit-data';
    fileCache = new FileMemory(folderName);
  }

  let response: Response | undefined;

  if (cacheOptions.strategy === 'cache-first') {
    if (fileCache.has(cacheKey)) {
      const cached = fileCache.get(cacheKey)!;
      if (cached.expiredAt > Date.now()) {
        return cached.response.clone();
      }
    }
    const res = await fetch(normalizedUrl, options);
    fileCache.set(cacheKey, {
      response: res.clone(),
      expiredAt: getExpiryTimeCacheKey(cacheOptions.revalidate),
    });
    return res;
  }

  else if (cacheOptions.strategy === 'network-first') {
    try {
      const res = await fetch(normalizedUrl, options);
      fileCache.set(cacheKey, {
        response: res.clone(),
        expiredAt: getExpiryTimeCacheKey(cacheOptions.revalidate),
      });
      return res;
    } catch {
      if (fileCache.has(cacheKey)) {
        const cached = fileCache.get(cacheKey)!;
        if (cached.expiredAt > Date.now()) {
          return cached.response.clone();
        }
      }
      throw new Error('Network failed and no valid cache found');
    }
  }

  else if (cacheOptions.strategy === 'stale-while-revalidate') {
    if (fileCache.has(cacheKey)) {
      const cached = fileCache.get(cacheKey)!;
      response = cached.response.clone();
    }

    fetch(normalizedUrl, options).then((res) => {
      fileCache!.set(cacheKey, {
        response: res,
        expiredAt: getExpiryTimeCacheKey(cacheOptions.revalidate),
      });
    }).catch(err => {
      console.warn('Revalidation failed:', err);
    });

    return response!;
  }

  throw new Error('No valid response available.');
};

export default nodeCachedFetch;
