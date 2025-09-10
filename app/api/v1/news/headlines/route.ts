import { ok, err, httpGetJson } from "@/src/lib/fetcher";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const since = searchParams.get("since") || "";
    const token = process.env.CRYPTOPANIC_TOKEN;

    if (token) {
      const url = new URL("https://cryptopanic.com/api/v1/posts/");
      url.searchParams.set("auth_token", token);
      url.searchParams.set("kind", "news");
      if (q) url.searchParams.set("q", q);
      const data = await httpGetJson(url.toString());
      const items = (data.results || []).map((r: any) => ({
        title: r.title,
        url: r.url,
        published_at: r.published_at,
        source: r.domain,
        currency: r.currencies?.map((c: any) => c.code) ?? []
      }));
      // since filtresi server tarafında basitçe uygulanabilir
      const filtered = since ? items.filter((it: any) => it.published_at >= since) : items;
      return ok({ provider: "cryptopanic", count: filtered.length, items: filtered });
    } else {
      const now = new Date().toISOString();
      return ok({
        provider: "mock",
        count: 2,
        items: [
          { title: "Mock: Bitcoin volatility ticks up", url: "https://example.com/1", published_at: now, source: "example.com", currency: ["BTC"] },
          { title: "Mock: ETH dev update", url: "https://example.com/2", published_at: now, source: "example.com", currency: ["ETH"] }
        ]
      });
    }
  } catch (e: any) {
    return err(500, e.message || "Internal error");
  }
}
