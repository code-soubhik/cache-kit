# ⚡ cache-kit

> A simple caching layer for `fetch` requests — supports memory, browser (localStorage), and Node.js (filesystem) adapters with smart strategies.

## 📦 Installation

```bash
npm install cache-kit
```

## ✨ Features

- 🌐 **Supports only GET requests** (for now)
- 📁 **Adapters**:
  - `memory`: In-memory Map cache
  - `browser`: Uses `localStorage`
  - `node`: File-based caching in `.cache/`
- 🧠 **Strategies**:
  - `cache-first`: Return fresh cache if available, else fetch
  - `network-first`: Try network first, fallback to cache if failed
  - `stale-while-revalidate`: Return stale cache instantly and update in background
- 🕒 **Revalidate** time in seconds (TTL-like behavior)

## 📌 Usage

```ts
import { cachedFetch } from 'cache-kit';

const res = await cachedFetch('https://api.example.com/data',
  { method: 'GET' },
  {
    revalidate: 60,
    strategy: 'stale-while-revalidate',
    adapter: 'browser'
  }
);

const data = await res.json();
```

## 🔧 Options

### `cachedFetch(url, options, cacheOptions)`

#### `options: RequestInit`
- Only `method: 'GET'` is supported
- No `body` support in Phase 1

#### `cacheOptions: CacheProps`

| Property    | Type                | Description                                          |
|-------------|---------------------|------------------------------------------------------|
| `revalidate`| `number`            | Cache TTL in seconds                                 |
| `strategy`  | `'cache-first'` \| `'network-first'` \| `'stale-while-revalidate'` | Strategy to use |
| `adapter`   | `'memory'` \| `'browser'` \| `'node'`     | Where to store cache                                 |

## 📁 Directory Structure (Simplified)

```
cache-kit/
├── adapters/
│   ├── browser.ts
│   ├── memory.ts
│   └── node.ts
├── utils/
│   └── common.ts
├── types.ts
├── index.ts
```

## 🚧 Future Scope

- [ ] Support non-GET requests
- [ ] Automatic cache invalidation
- [ ] Custom cache key generator
- [ ] TypeScript improvements

## 📄 License

MIT