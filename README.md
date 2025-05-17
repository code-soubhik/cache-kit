# ⚡ cache-kit

> A smart caching layer for `fetch` requests — supports memory, browser (localStorage), and Node.js (filesystem) with modern caching strategies.

---

## 📦 Installation

```bash
npm install cache-kit
```

Or use it directly in the browser via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/cache-kit@1.1.2/cdn/cache-kit.min.js"></script>
```

---

## ✨ Features

- 🌐 **Only supports GET requests** (for now)
- 📁 **Adapters**:
  - `memory`: In-memory (Node/React/Next.js)
  - `browser`: Uses `localStorage`
  - `node`: Filesystem caching in `.cache/`
- 🧠 **Strategies**:
  - `cache-first`: Serve cache if available, fetch if not
  - `network-first`: Try network first, fallback to cache on failure
  - `stale-while-revalidate`: Serve stale cache immediately, fetch and update in background
- 🕒 **TTL support**: Set revalidation interval in seconds
- 🧩 **Core logic in**: `cacheManager.ts`

---

## 📌 Quick Usage

### Node.js

```ts
import { cachedFetch } from 'cache-kit';

(async () => {
  const res = await cachedFetch('https://api.example.com/data',
    { method: 'GET' },
    {
      adapter: 'node',
      strategy: 'cache-first',
      revalidate: 300
    }
  );

  const data = await res.json();
  console.log(data);
})();
```

### React / Next.js

```ts
useEffect(() => {
  (async () => {
    const res = await cachedFetch('/api/user', { method: 'GET' }, {
      adapter: 'browser',
      strategy: 'stale-while-revalidate',
      revalidate: 60
    });
    const data = await res.json();
    setData(data);
  })();
}, []);
```

### Vanilla Browser (via CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/cache-kit@1.1.2/cdn/cache-kit.min.js"></script>
<script>
  (async () => {
    const res = await window.cacheKit.cachedFetch('https://api.example.com/data',
      { method: 'GET' },
      {
        adapter: 'browser',
        strategy: 'network-first',
        revalidate: 60
      }
    );
    const data = await res.json();
    console.log(data);
  })();
</script>
```

---

## 🔧 API

### `cachedFetch(url, options, cacheOptions)`

#### `options: RequestInit`
- Only `method: 'GET'` is supported.

#### `cacheOptions: CacheProps`

| Property     | Type                                                   | Description                    |
|--------------|--------------------------------------------------------|--------------------------------|
| `revalidate` | `number`                                               | TTL (cache expiry in seconds) |
| `strategy`   | `'cache-first'` \| `'network-first'` \| `'stale-while-revalidate'` | Caching strategy              |
| `adapter`    | `'memory'` \| `'browser'` \| `'node'`                  | Cache storage backend         |

---

## 📁 Project Structure (Simplified)

```
cache-kit/
├── adapters/
│   ├── browser.ts
│   ├── memory.ts
│   └── node.ts
├── utils/
│   ├── common.util.ts
│   └── cache.util.ts
├── cacheManager.ts
├── index.ts
├── types.ts
```

---

## 🚧 Future Scope

- [ ] Add support for non-GET methods (`POST`, `PUT`, etc.)
- [ ] Automatic cache invalidation on triggers
- [ ] Custom cache key generator
- [ ] More storage backends (e.g., IndexedDB)
- [ ] Tag-based cache invalidation

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest enhancements.

---

## 📄 License

MIT — free to use.
