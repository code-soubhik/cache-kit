import { cacheDataType } from "../types";
import fs from 'fs';
import path from 'path';

export const BrowserMemory = {
    set: async function (key: string, data: cacheDataType): Promise<void> {
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
    get: function (key: string): cacheDataType | null {
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
    has: function (key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}

export const cacheMemory: Map<string, cacheDataType> = new Map();

export const FileMemory = {
    set: function (key: string, data: cacheDataType): void {
        const filepath = path.resolve("./cache", `${key}.json`);
        fs.writeFileSync(filepath, JSON.stringify(data));
    },
    get: function (key: string):cacheDataType {
        const filepath = path.resolve("./cache", `${key}.json`);
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    },
    has: function (key: string): boolean {
        const files = fs.existsSync('./cache') ? fs.readdirSync('./cache') : [];
        return files.includes(`${key}.json`)
    }
}