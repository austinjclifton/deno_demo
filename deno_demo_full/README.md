# 📘 Deno Notes Demo — Feature Overview

Emoji for trash can: 🗑️

This project is a small Notes application built to demonstrate Deno's modern runtime features in a
clear, practical way. It highlights how Deno simplifies full-stack development using built-in
tooling, powerful defaults, and modern Web APIs.

---

## 🚀 What This Demo Showcases

### 1. Zero-config TypeScript Support

Deno runs TypeScript out of the box — no bundlers, no compilers, no tsconfig.

- The backend (`server/`) is written entirely in TypeScript

### 2. Modern Web APIs Available Server-Side

Deno uses web-standard APIs instead of Node-specific ones. This project demonstrates:

- **`fetch()`** — Used in the frontend (`app.js`) for all API calls (GET, POST, DELETE)
- **`URL`** — Used in the server (`server.ts`) to parse request URLs: `new URL(req.url)`
- **`Request`** — The server handler receives a standard `Request` object (used via `req.json()`)
- **`Response`** — Server returns standard `Response` objects for JSON responses
- **`crypto.randomUUID()`** — Used in `notes_kv.ts` to generate unique note IDs
- **`Intl.DateTimeFormat`** — Used in the frontend (`app.js`) to format timestamps

These work the same in Deno and in the browser, making it easy to share code and knowledge between
client and server.

### 3. Deno KV — Built-in Persistent Database

No database setup required. One line opens a fully local embedded KV database:

```typescript
const kv = await Deno.openKv();
```

Notes are stored and read directly from Deno's native KV store.

### 4. URL Imports

Deno can import dependencies HTTP-first using URLs.

**Example** (from `deno.json` import map):

```json
"imports": {
  "@std/file_server": "https://deno.land/std@0.224.0/http/file_server.ts",
  "@emoji": "https://deno.land/x/emoji/mod.ts"
}
```

This allows writing clean imports like:

```typescript
import { serveDir } from "@std/file_server";
import * as emoji from "@emoji";
```

The emoji library is used to add random emojis to each note (e.g., `emoji.random().emoji`).

### 5. npm Compatibility

Deno can import npm packages without `npm install` or `node_modules`.

This project uses:

```typescript
import slugify from "npm:slugify";
```

Deno resolves, caches, and isolates npm dependencies automatically.

### 6. Built-in Tools (No External Dependencies)

Deno includes all essential tooling:

- **Formatter** → `deno fmt`
- **Linter** → `deno lint`
- **Test runner** → `deno test`
- **Task runner** → `deno task <name>`
- **Watch mode** → `deno run --watch`

This project includes tasks in `deno.json`:

```json
"tasks": {
  "run": "deno run --watch --unstable-kv --allow-net --allow-read=public server/server.ts",
  "fmt": "deno fmt",
  "lint": "deno lint",
  "test": "deno test"
}
```

### 7. Permissions System (Secure by Default)

Deno executes with zero permissions unless granted explicitly:

- `--allow-net` → required for the HTTP server
- `--allow-read=public` → required to serve static files
- `--unstable-kv` → enables KV database

This makes runtime access explicit and secure.

### 8. Lightweight Frontend Powered by Native ES Modules

The browser-side code (`public/app.js`) uses:

- Native `fetch()` calls
- DOM manipulation
- `Intl.DateTimeFormat` for timestamp formatting
- ES module imports
- **No bundlers or build steps**

Everything is served directly by Deno.

### 9. Optional Demo Toggle ("Slug Mode")

A small example feature that shows:

- Server-side state
- npm package usage
- Custom API routes
- Minimal frontend interaction

Turning the toggle on/off changes how new notes are stored.

---

## ⚙️ Configuration (`deno.json`)

The `deno.json` file configures Deno's behavior for this project:

### Tasks

Tasks define npm-style scripts that can be run with `deno task <name>`:

- **`run`** — Starts the development server with:
  - `--watch` — Auto-reloads on file changes
  - `--unstable-kv` — Enables Deno KV (key-value database) features
  - `--allow-net` — Allows network access (required for the HTTP server)
  - `--allow-read=public` — Allows reading files from the public directory (for serving static
    files)

### Import Map

The `imports` section defines aliases for commonly used imports:

- **`@std/file_server`** — Alias for Deno's standard file server library, allowing clean imports
  like `import { serveDir } from "@std/file_server"` instead of the full URL

### Formatting

The `fmt` section configures code formatting:

- **`lineWidth: 100`** — Sets the maximum line width for the formatter

---

## 🗂 Project Structure

```
deno-demo/
├── deno.json
├── server/
│   ├── server.ts
│   └── notes_kv.ts
├── public/
│   ├── index.html
│   ├── app.js
│   └── main.css
└── tests/
    └── basic.test.ts
```

---

## 🏁 Running the Project

### Start the Dev Server

```bash
deno task run
```

Visit: **http://localhost:8000**



*note if imports still come up with an error after moving them into deno.json, run

deno cache deno.json

Explanation: Deno needs to cache remote dependencies before use. Running deno cache deno.json
downloaded and cached all dependencies from the import map. Note: When adding new remote
dependencies to deno.json, run deno cache deno.json to cache them, or Deno will cache them
automatically on first use if you have network access.
