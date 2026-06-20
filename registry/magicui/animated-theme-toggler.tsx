"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, SunDim } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Minimal typing for the View Transitions API (not in every TS DOM lib). */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export const AnimatedThemeToggler = ({ className }: Props) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(async () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const applyTheme = () => flushSync(() => setTheme(next));

    const startViewTransition = (
      document as ViewTransitionDocument
    ).startViewTransition?.bind(document);

    // Fall back gracefully where the View Transitions API is unsupported.
    if (!startViewTransition || !buttonRef.current) {
      applyTheme();
      return;
    }

    await startViewTransition(applyTheme).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [resolvedTheme, setTheme]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {mounted && resolvedTheme === "dark" ? (
        <SunDim className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};
