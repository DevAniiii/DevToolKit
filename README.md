# Developer Security Toolkit

A modern, all-in-one developer utility that combines **JWT decoding**, **Base64 encoding/decoding**, and **JSON formatting** in a single web app. Everything runs 100% client-side — your data never leaves the browser.

## Features

### 1. JWT Decoder & Inspector
- Decodes header and payload
- Pretty JSON formatting
- Shows algorithm, `iat`, `exp` (as readable UTC)
- Expiry status with `valid` / `expired` / `not-yet-valid` warnings
- Copy and download decoded results

### 2. Base64 Encoder / Decoder
- Encode text → Base64 and decode Base64 → text (UTF-8 safe)
- One-click swap between encode/decode
- Input validation & error handling
- Copy output

### 3. JSON Formatter
- Beautify, minify and validate JSON
- Live validity badge with byte count
- Copy and download formatted output

## Tech Stack
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with shadcn/ui-style components
- **lucide-react** icons
- **sonner** toasts
- Light/dark theme via **next-themes**

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

## Configuration

The footer name/email and sponsor link live in [`lib/site.ts`](lib/site.ts).
Update `author.name` and `author.email` with your details:

```ts
author: {
  name: "Your Name",
  email: "you@example.com",
},
```

## Project Structure

```
app/
  layout.tsx          # Root layout, theme provider, header/footer, toaster
  page.tsx            # Landing page + tool selector
  globals.css         # Tailwind layers + theme tokens
components/
  tools/              # jwt-decoder, base64-tool, json-formatter
  ui/                 # button, card, textarea, tabs, badge
  site-header.tsx, site-footer.tsx, theme-*, copy-button.tsx
lib/
  jwt.ts, base64.ts   # Pure decoding logic
  site.ts, utils.ts   # Config + helpers
```
