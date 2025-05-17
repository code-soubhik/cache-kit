export interface CacheProps {
  revalidate?: number; // seconds
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  adapter: 'memory' | 'browser' | 'node';
};

export interface cacheDataType {
  expiredAt: number
  response: Response
}