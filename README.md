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


## Project Structure

```
app/
  layout.tsx         
  page.tsx           
  globals.css        
components/
  tools/            
  ui/             
  site-header.tsx, site-footer.tsx, theme-*, copy-button.tsx
lib/
  jwt.ts, base64.ts  
  site.ts, utils.ts   
```
