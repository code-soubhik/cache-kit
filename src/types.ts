export interface CacheProps {
  revalidate?: number; // seconds
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  adapter: 'memory' | 'browser' | 'node';
  folderName?: string; // for node adapter 
};

export interface cacheDataType {
  expiredAt: number
  response: Response
}

export interface cacheFunctionStructure {
  set: (key: string, data: cacheDataType) => void;
  get: (key: string) => cacheDataType | null;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  clear: () => void;
}