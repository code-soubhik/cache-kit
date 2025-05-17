export const getExpiryTimeCacheKey = (expirySeconds: number | undefined): number => {

    if (!expirySeconds)
        return '::';

    const expiryTime = Date.now() + expirySeconds * 1000;

    return `::${expiryTime}`;
}