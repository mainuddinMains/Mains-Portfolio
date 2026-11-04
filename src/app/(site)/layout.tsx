import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader siteName={settings.name} />
      <main id="main" className="flex-1 py-10 sm:py-16">
        {children}
      </main>
      <SiteFooter name={settings.name} social={settings.social} />
    </>
  );
}
