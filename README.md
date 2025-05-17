# ⚡ cache-kit

> A smart caching layer for `fetch` requests — supports memory, browser (localStorage), and Node.js (filesystem) with modern caching strategies.

---

## 📦 Installation

```bash
npm install cache-kit
```

Or use it directly in the browser via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/cache-kit@1.1.1/cdn/browser-ODKShLB1.js"></script>
```

---

## ✨ Features

- 🌐 **Only supports GET requests** (for now)
- 📁 **Adapters**:
  - `memory`: In-memory (for Node/React/Next.js)
  - `browser`: Uses `localStorage`
  - `node`: File-system caching using `.cache/`
- 🧠 **Strategies**:
  - `cache-first`: Serve cache if available, fetch if not
  - `network-first`: Try network first, fallback to cache on failure
  - `stale-while-revalidate`: Serve stale cache immediately, fetch and update in background
- 🕒 **TTL support**: Set revalidation interval in seconds
- ⚙️ **Zero-config support** for:
  - ✅ React
  - ✅ Next.js
  - ✅ Node.js
  - ✅ Vanilla JS

---

## 📌 Quick Usage

### TypeScript / JavaScript (React, Next.js, Node.js)

```ts
import { cachedFetch } from 'cache-kit';

const res = await cachedFetch('https://api.example.com/data',
  { method: 'GET' },
  {
    revalidate: 60,
    strategy: 'stale-while-revalidate',
    adapter: 'memory' // or 'browser' for client-side
  }
);

const data = await res.json();
```

### Browser (Vanilla JS)

```html
<script src="https://cdn.jsdelivr.net/npm/cache-kit@1.1.1/cdn/browser-ODKShLB1.js"></script>
<script>
  (async () => {
    const res = await window.cacheKit.cachedFetch('https://api.example.com/data', 
      { method: 'GET' }, 
      {
        revalidate: 60,
        strategy: 'network-first',
        adapter: 'browser'
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
- Only `method: 'GET'` is supported in current version.

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
├── index.ts
├── types.ts
```

---

## 🚀 Framework Support

### ✅ Next.js

```ts
// Use inside getServerSideProps or API Routes
import { cachedFetch } from 'cache-kit';

export async function getServerSideProps() {
  const res = await cachedFetch('https://api.example.com/info',
    { method: 'GET' },
    { adapter: 'memory', strategy: 'cache-first', revalidate: 120 }
  );
  const data = await res.json();
  return { props: { data } };
}
```

### ✅ React

```ts
useEffect(() => {
  (async () => {
    const res = await cachedFetch('/api/info', { method: 'GET' }, {
      adapter: 'browser',
      strategy: 'stale-while-revalidate',
      revalidate: 30
    });
    const data = await res.json();
    setData(data);
  })();
}, []);
```

---

## 🛣️ Roadmap

- [ ] Add support for non-GET methods (`POST`, `PUT`, etc.)
- [ ] Automatic cache invalidation on certain triggers
- [ ] Custom cache key generator
- [ ] Fine-grained control with tags
- [ ] More storage backends (e.g., IndexedDB)

---

## 📄 License

MIT — feel free to use, modify, and contribute.
