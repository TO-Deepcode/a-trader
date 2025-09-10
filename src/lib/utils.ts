export function normalizeSymbol(sym: string): string {
  const s = sym.replace("/", "").toUpperCase().trim();
  return s;
}

export function mapIntervalToBinance(i: string): string {
  const map: Record<string, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "4h": "4h",
    "1d": "1d"
  };
  if (!map[i]) throw new Error(`Unsupported interval: ${i}`);
  return map[i];
}
