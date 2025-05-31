import { cacheDataType, cacheFunctionStructure } from '../types';
import fs from 'fs';
import path from 'path';
import { makeKey } from './common.util';

const Memory: Map<string, cacheDataType> = new Map();

export const BrowserMemory: cacheFunctionStructure = {
    set: async function (_key: string, data: cacheDataType): Promise<void> {
        const key = makeKey(_key);
        const text = await data.response.clone().text();
        const resData = {
            responseBody: text,
            expiredAt: data.expiredAt,
            headers: Object.fromEntries(data.response.headers.entries()),
            status: data.response.status,
            statusText: data.response.statusText,
        };
        window.localStorage.setItem(key, JSON.stringify(resData));
    },
    get: function (_key: string): cacheDataType | null {
        const key = makeKey(_key);
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            const { responseBody, expiredAt, headers, status, statusText } = parsed;
            return {
                expiredAt,
                response: new Response(responseBody, {
                    headers,
                    status,
                    statusText,
                }),
            };
        } catch {
            return null;
        }
    },
    has: function (_key: string): boolean {
        const key = makeKey(_key);
        return localStorage.getItem(key) !== null;
    },
    delete: function (_key: string): void {
        const key = makeKey(_key);
        localStorage.removeItem(key);
    },
    clear: function (): void {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
            if (key.startsWith('__CACHE_KIT__::')) {
                localStorage.removeItem(key);
            }
        }
    }
};

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
}

export const FileMemory: cacheFunctionStructure = {
    set: function (key: string, data: cacheDataType): void {
        const filepath = path.resolve('./cache', `${key}.json`);
        fs.writeFileSync(filepath, JSON.stringify(data));
    },
    get: function (key: string): cacheDataType {
        const filepath = path.resolve('./cache', `${key}.json`);
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    },
    has: function (key: string): boolean {
        const files = fs.existsSync('./cache') ? fs.readdirSync('./cache') : [];
        return files.includes(`${key}.json`);
    },
    delete: function (key: string): void {
        const filepath = path.resolve('./cache', `${key}.json`);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    },
    clear: function (): void {
        const dir = path.resolve('./cache');
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    fs.unlinkSync(path.join(dir, file));
                }
            }
        }
    }
};