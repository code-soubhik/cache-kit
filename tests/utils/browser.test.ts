// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BrowserMemory } from '../../src/utils/browser.util';

describe('BrowserMemory (browser localStorage cache)', () => {
    const TEST_KEY = 'test-browser-key';
    const TEST_DATA = {
        expiredAt: Date.now() + 10000,
        response: new Response('Browser response', {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'text/plain' }
        })
    };

    beforeEach(() => {
        BrowserMemory.clear();
        window.localStorage.clear();
    });

    afterEach(() => {
        BrowserMemory.clear();
        window.localStorage.clear();
    });

    it('should set and get cache data correctly', async () => {
        await BrowserMemory.set(TEST_KEY, TEST_DATA);
        const cached = BrowserMemory.get(TEST_KEY);
        expect(cached).not.toBeNull();
        expect(cached?.expiredAt).toBe(TEST_DATA.expiredAt);
        const text = await cached?.response.text();
        expect(text).toBe('Browser response');
    });

    it('should return true for existing key using has()', async () => {
        await BrowserMemory.set(TEST_KEY, TEST_DATA);
        expect(BrowserMemory.has(TEST_KEY)).toBe(true);
    });

    it('should delete a key properly', async () => {
        await BrowserMemory.set(TEST_KEY, TEST_DATA);
        BrowserMemory.delete(TEST_KEY);
        expect(BrowserMemory.has(TEST_KEY)).toBe(false);
    });

    it('should return null for non-existing key', () => {
        const cached = BrowserMemory.get('non-existing-browser-key');
        expect(cached).toBeNull();
    });

    it('should clear all cache data', async () => {
        BrowserMemory.set('browser-key-1', TEST_DATA);
        BrowserMemory.set('browser-key-2', TEST_DATA);
        BrowserMemory.clear();
        expect(BrowserMemory.has('browser-key-1')).toBe(false);
        expect(BrowserMemory.get('browser-key-1')).toBeNull();
        expect(BrowserMemory.has('browser-key-2')).toBe(false);
        expect(BrowserMemory.get('browser-key-2')).toBeNull();
    });
});