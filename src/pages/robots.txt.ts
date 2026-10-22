import release from "../data/release.json";

export function GET() {
  const content =
    release.status === "public"
      ? "User-agent: *\nAllow: /\nSitemap: https://jonathangwesterfield.github.io/sitemap-index.xml\n"
      : "User-agent: *\nDisallow: /\n";

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
