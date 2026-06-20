import { ExternalLink, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{siteConfig.author.name}</p>
          <a
            href={`mailto:${siteConfig.author.email}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5" />
            {siteConfig.author.email}
          </a>
        </div>

        <a
          href={siteConfig.sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "default", className: "group" })}
        >
          {siteConfig.sponsor.text}
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </footer>
  );
}
