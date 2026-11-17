const fallback = "https://www.paypal.com/ncp/payment/PUMXJMAPDWRK6";

export function paypalPaymentLink() {
  const configured = process.env.PAYPAL_PAYMENT_LINK?.trim() || fallback;
  if (!configured.startsWith("https://www.paypal.com/ncp/payment/")) return null;
  return configured;
}
