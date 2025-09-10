import { err, ok } from "@/src/lib/fetcher";
import { getCandlesBinance } from "@/src/lib/binance";
import { getCandlesBybit } from "@/src/lib/bybit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const interval = searchParams.get("interval");
    const limit = Number(searchParams.get("limit") ?? "500");
    const exchange = (searchParams.get("exchange") ?? "binance").toLowerCase();

    if (!symbol || !interval) return err(400, "Missing required params: symbol, interval");

    let payload;
    if (exchange === "binance") {
      payload = await getCandlesBinance(symbol, interval, limit);
    } else if (exchange === "bybit") {
      payload = await getCandlesBybit(symbol, interval, limit);
    } else {
      return err(400, `Unsupported exchange: ${exchange}`);
    }
    return ok(payload);
  } catch (e: any) {
    return err(500, e.message || "Internal error");
  }
}
