import { httpGetJson } from "./fetcher";
import { normalizeSymbol } from "./utils";

const BYBIT_INTERVALS: Record<string, string> = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "1h": "60",
  "4h": "240",
  "1d": "D"
};

export async function getCandlesBybit(symbolRaw: string, interval: string, limit = 500) {
  const symbol = normalizeSymbol(symbolRaw);
  const itv = BYBIT_INTERVALS[interval];
  if (!itv) throw new Error(`Unsupported interval: ${interval}`);
  const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${itv}&limit=${limit}`;
  const data = await httpGetJson(url);
  const list = data.result?.list ?? [];
  const candles = list.map((row: any[]) => [
    new Date(Number(row[0])).toISOString(),
    parseFloat(row[1]),
    parseFloat(row[2]),
    parseFloat(row[3]),
    parseFloat(row[4]),
    parseFloat(row[5])
  ]);
  return { symbol, interval, exchange: "bybit", candles };
}

export async function getMetadataBybit(symbolRaw: string) {
  const symbol = normalizeSymbol(symbolRaw);
  const url = `https://api.bybit.com/v5/market/instruments-info?category=linear&symbol=${symbol}`;
  const data = await httpGetJson(url);
  const inst = data.result?.list?.[0];
  if (!inst) throw new Error(`Symbol not found on Bybit: ${symbol}`);
  return {
    symbol,
    exchange: "bybit",
    tickSize: inst?.priceFilter?.tickSize ?? null,
    stepSize: inst?.lotSizeFilter?.qtyStep ?? null,
    minNotional: inst?.lotSizeFilter?.minOrderQty ?? null
  };
}
