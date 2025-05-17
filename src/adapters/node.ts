import fs from 'fs';
import path from 'path';

import { cacheDataType, CacheProps } from '../types';
import { getExpiryTimeCacheKey } from "../utils/common";

const FileMemory = {
    set: function (key: string, data: cacheDataType): void{
        const filepath = path.resolve("./cache", `${key}.json`);
        fs.writeFileSync(filepath, JSON.stringify(data)); 
    },
    get: function (key: string) {
        const filepath = path.resolve("./cache", `${key}.json`);
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    },
    has: function (key: string) {
        const files = fs.readdirSync("./cache");
        if(files.includes(`${key}.json`)) return true;
        return false;
    }
}

export const nodeCachedFetch = async (
    normalizedUrl: string,
    options: RequestInit,
    cacheOptions: CacheProps
): Promise<Response> => {

    // Create a .cache folder if not exists
    if(!fs.existsSync("cache")) 
        fs.mkdirSync("cache")

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
            }
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
            }
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
                console.warn("Background revalidation failed:", err);
            });
    }

    if (!response) {
        throw new Error("No valid response available.");
    }

    return response;
}