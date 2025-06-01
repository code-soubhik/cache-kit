import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { cacheMemory } from '../../src/utils/memory.util';

const TEST_DATA = {
    expiredAt: Date.now() + 10000,
    response: new Response('Mocked response', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/plain' }
    })
};

describe('cacheMemory (in-memory cache)', () => {
    beforeAll(() => {
        cacheMemory.clear();
    });

    afterAll(() => {
        cacheMemory.clear();
    });

    it('should set and get cache data correctly', () => {
        const test_key = 'test-key';
        cacheMemory.set(test_key, TEST_DATA);
        const cached = cacheMemory.get(test_key);
        expect(cached).not.toBeNull();
        expect(cached?.expiredAt).toBe(TEST_DATA.expiredAt);
    });

    it('should return true for existing key using has()', () => {
        const test_key = 'test-key';
        cacheMemory.set(test_key, TEST_DATA);
        expect(cacheMemory.has(test_key)).toBe(true);
    });

    it('should delete a key properly', () => {
        const test_key = 'test-key';
        cacheMemory.set(test_key, TEST_DATA);
        cacheMemory.delete(test_key);
        expect(cacheMemory.has(test_key)).toBe(false);
    });

    it('should return null for non-existing key', () => {
        const test_key = 'non-existing-key';
        const cached = cacheMemory.get(test_key);
        expect(cached).toBeNull();
    });

    it('should clear all cache data', () => {
        const test_key_1 = 'test-key-1';
        const test_key_2 = 'test-key-2';
        cacheMemory.set(test_key_1, TEST_DATA);
        cacheMemory.set(test_key_2, TEST_DATA);
        cacheMemory.clear();
        expect(cacheMemory.has(test_key_1)).toBe(false);
        expect(cacheMemory.get(test_key_1)).toBeNull();
        expect(cacheMemory.has(test_key_2)).toBe(false);
        expect(cacheMemory.get(test_key_2)).toBeNull();
    });
});

