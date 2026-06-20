import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
          <span className="sm:hidden">DevSec Toolkit</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            All processing happens in your browser
          </a>
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  );
}
