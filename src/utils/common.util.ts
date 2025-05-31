export const getExpiryTimeCacheKey = (expirySeconds: number | undefined): number => {

    if (!expirySeconds)
        return Infinity;

    const expiryTime:number = Date.now() + expirySeconds * 1000;

    return expiryTime;
};

export const makeKey = (key: string) => `__CACHE_KIT__::${key}`;
