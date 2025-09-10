import { err, ok } from "@/src/lib/fetcher";
import { getMetadataBinance } from "@/src/lib/binance";
import { getMetadataBybit } from "@/src/lib/bybit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const exchange = (searchParams.get("exchange") ?? "").toLowerCase();

    if (!symbol || !exchange) return err(400, "Missing required params: symbol, exchange");
    if (!["binance", "bybit"].includes(exchange)) return err(400, `Unsupported exchange: ${exchange}`);

    const payload = exchange === "binance"
      ? await getMetadataBinance(symbol)
      : await getMetadataBybit(symbol);

    return ok(payload);
  } catch (e: any) {
    return err(500, e.message || "Internal error");
  }
}
