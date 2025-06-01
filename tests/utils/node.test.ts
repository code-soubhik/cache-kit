import { describe, it, expect, afterAll } from 'vitest';
import { FileMemory } from '../../src/utils/node.util';
import fs from 'fs';
import path from 'path';
import { cacheDataType } from '../../src/types';

const TEST_FOLDER = 'test-node-cache';
const TEST_KEY_1 = 'test-node-key-1';
const TEST_KEY_2 = 'test-node-key-2';
const TEST_KEY_3 = 'test-node-key-3';
const TEST_KEY_4 = 'test-node-key-4';
const TEST_KEY_5 = 'test-node-key-5';
const TEST_DATA: cacheDataType = {
    expiredAt: Date.now() + 10000,
    response: new Response('Mocked response', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/plain' }
    })
};

describe('FileMemory (Node.js file-based cache)', () => {
    const fileCache: FileMemory = new FileMemory(TEST_FOLDER);
    const cacheDir: string = path.resolve('./cache-kit', TEST_FOLDER);

    afterAll(() => {
        // Remove the folder itself, even if not empty
        if (fs.existsSync(cacheDir)) {
            fs.rmSync(cacheDir, { recursive: true, force: true });
        }
    });

    it('should set and get cache data correctly', () => {
        fileCache.set(TEST_KEY_1, TEST_DATA);
        const cached = fileCache.get(TEST_KEY_1);
        expect(cached).not.toBeNull();
        expect(cached?.expiredAt).toBe(TEST_DATA.expiredAt);
    });

    it('should return true for existing key using has()', () => {
        fileCache.set(TEST_KEY_2, TEST_DATA);
        expect(fileCache.has(TEST_KEY_2)).toBe(true);
    });

    it('should delete a key properly', () => {
        fileCache.set(TEST_KEY_3, TEST_DATA);
        fileCache.delete(TEST_KEY_3);
        expect(fileCache.has(TEST_KEY_3)).toBe(false);
    });

    it('should return null for non-existing key', () => {
        const cached = fileCache.get(TEST_KEY_4);
        expect(cached).toBeNull();
    });

    it('should clear all cache data', () => {
        fileCache.set(TEST_KEY_4, TEST_DATA);
        fileCache.set(TEST_KEY_5, TEST_DATA);
        fileCache.clear();
        expect(fileCache.has(TEST_KEY_4)).toBe(false);
        expect(fileCache.get(TEST_KEY_4)).toBeNull();
        expect(fileCache.has(TEST_KEY_5)).toBe(false);
        expect(fileCache.get(TEST_KEY_5)).toBeNull();
    });
});