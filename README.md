# Atlas Trader — Read-only API (Vercel / Next.js App Router)

Bu proje, Custom GPT'inizin güvenli biçimde veri çekmesi için **salt-oku** uçlar sağlar:
- `/api/v1/market/candles`
- `/api/v1/market/metadata`
- `/api/v1/news/headlines`

> Emir gönderme **yok**; yalnızca analiz için veri sağlar.

## Hızlı Başlangıç
1. Bu dizini bir Git repo'ya koyun ve Vercel'e bağlayın.
2. Vercel üzerinde **Environment Variables**:
   - `ATLAS_API_KEY` → API anahtarınız (Custom GPT `X-API-Key` gönderir).
   - `CRYPTOPANIC_TOKEN` → (opsiyonel) News kaynağı olarak CryptoPanic kullanırsanız.
3. Deploy edin. Base URL’niz örn. `https://your-project.vercel.app` olacaktır.

## Kimlik Doğrulama
Tüm `/api/` rotaları `X-API-Key: <ATLAS_API_KEY>` başlığı olmadan 401 döner.

## Uçlar

### GET /api/v1/market/candles
Parametreler:
- `symbol` (zorunlu) — Örn. `BTCUSDT` veya `BTC/USDT`
- `interval` (zorunlu) — `1m,5m,15m,1h,4h,1d`
- `limit` (ops.) — Varsayılan 500
- `exchange` (ops.) — `binance` (varsayılan), `bybit`

Yanıt:
```json
{
  "symbol": "BTCUSDT",
  "interval": "4h",
  "exchange": "binance",
  "candles": [["2025-01-01T00:00:00.000Z",57200,57550,57010,57380,1823.4]]
}
```

### GET /api/v1/market/metadata
Parametreler:
- `symbol` (zorunlu)
- `exchange` (zorunlu) — `binance` veya `bybit`

Yanıt (örnek):
{
  "symbol": "BTCUSDT",
  "exchange": "binance",
  "tickSize": "0.10",
  "stepSize": "0.00001000",
  "minNotional": "10.00"
}

### GET /api/v1/news/headlines
Parametreler:
- `q` (ops.) — Sorgu
- `since` (ops.) — ISO tarih/saat (UTC)

News kaynağı: Eğer `CRYPTOPANIC_TOKEN` setlenmişse CryptoPanic; değilse statik/mock yanıt döner.

## Notlar
- Tüm yanıtlar **CORS açık** gelir.
- Kaynak kodu TypeScript ve Next.js 14 App Router kullanır.
- İsteğe bağlı olarak `exchange` parametresiyle Bybit/diğerleri eklenebilir.
