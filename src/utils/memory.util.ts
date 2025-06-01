import { cacheDataType, cacheFunctionStructure } from '../types';

const Memory: Map<string, cacheDataType> = new Map();

export const cacheMemory: cacheFunctionStructure = {
    set: function (key: string, data: cacheDataType): void {
        Memory.set(key, data);
    },
    get: function (key: string): cacheDataType | null {
        return Memory.get(key) || null;
    },
    has: function (key: string): boolean {
        return Memory.has(key);
    },
    delete: function (key: string): void {
        Memory.delete(key);
    },
    clear: function (): void {
        Memory.clear();
    }
};
