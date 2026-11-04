import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { Container } from "@/components/ui/container";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:rounded focus:bg-foreground focus:px-3 focus:py-1 focus:text-background"
      >
        Skip to content
      </a>
      <Container className="relative flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {siteName}
        </Link>
        <DesktopNav items={mainNav} />
        <MobileNav items={mainNav} />
      </Container>
    </header>
  );
}
