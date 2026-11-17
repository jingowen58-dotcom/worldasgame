export function formatMinor(amountMinor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}
