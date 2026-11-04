import type { SocialLinks } from "@/domain/content";
import { Container } from "@/components/ui/container";

const labels: Record<keyof SocialLinks, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  scholar: "Google Scholar",
  twitter: "X",
  email: "Email",
};

export async function SiteFooter({ name, social }: { name: string; social: SocialLinks }) {
  // Cached so the build-time year is part of the static shell.
  "use cache";
  const links = (Object.keys(labels) as (keyof SocialLinks)[])
    .filter((key) => social[key])
    .map((key) => ({
      key,
      label: labels[key],
      href: key === "email" ? `mailto:${social[key]}` : (social[key] as string),
    }));

  return (
    <footer className="mt-auto border-t border-border py-8 text-sm text-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        {links.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {links.map((link) => (
              <li key={link.key}>
                <a href={link.href} className="hover:text-foreground" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
