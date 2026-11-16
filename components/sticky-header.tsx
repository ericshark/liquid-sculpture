"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { heroContent } from "@/data/showcase";
import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Compact nav that slides in once the hero has scrolled away. */
export default function StickyHeader() {
  const theme = useTheme();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      inert={!shown}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border bg-background/75 backdrop-blur-md transition-transform duration-500 ease-out",
        shown ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <nav
        aria-label="Sections"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8"
      >
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          {heroContent.brand}
        </a>
        <div className="flex items-center gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"
          >
            {theme === "dark" ? (
              <Sun size={14} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Moon size={14} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
          <a
            href="#top"
            className="rounded-full bg-foreground px-3.5 py-1.5 font-medium text-background transition-opacity hover:opacity-85"
          >
            Back to top ↑
          </a>
        </div>
      </nav>
    </header>
  );
}
