import { httpGetJson } from "./fetcher";
import { normalizeSymbol, mapIntervalToBinance } from "./utils";

export async function getCandlesBinance(symbolRaw: string, interval: string, limit = 500) {
  const symbol = normalizeSymbol(symbolRaw);
  const itv = mapIntervalToBinance(interval);
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${itv}&limit=${limit}`;
  const data = await httpGetJson(url);
  const candles = data.map((row: any[]) => [
    new Date(row[0]).toISOString(),
    parseFloat(row[1]),
    parseFloat(row[2]),
    parseFloat(row[3]),
    parseFloat(row[4]),
    parseFloat(row[5])
  ]);
  return { symbol, interval, exchange: "binance", candles };
}

export async function getMetadataBinance(symbolRaw: string) {
  const symbol = normalizeSymbol(symbolRaw);
  const info = await httpGetJson("https://api.binance.com/api/v3/exchangeInfo");
  const s = info.symbols.find((x: any) => x.symbol === symbol);
  if (!s) throw new Error(`Symbol not found on Binance: ${symbol}`);
  const lot = s.filters.find((f: any) => f.filterType === "LOT_SIZE");
  const price = s.filters.find((f: any) => f.filterType === "PRICE_FILTER");
  const notional = s.filters.find((f: any) => f.filterType === "NOTIONAL" || f.filterType === "MIN_NOTIONAL");
  return {
    symbol,
    exchange: "binance",
    tickSize: price?.tickSize ?? null,
    stepSize: lot?.stepSize ?? null,
    minNotional: notional?.minNotional ?? null
  };
}
