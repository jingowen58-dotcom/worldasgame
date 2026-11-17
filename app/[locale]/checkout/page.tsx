import Link from "next/link";
import { PayPalButton } from "@/components/PayPalButton";
import { getCopy } from "@/lib/copy";
import { site } from "@/lib/site";
import { readLocale } from "@/lib/read-locale";
import { libraryFor, publishedProduct } from "@/server/commerce";
import { paypalPaymentLink } from "@/server/paypal";
import { currentUser } from "@/server/session";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const user = await currentUser();
  const pending = user ? (await libraryFor(user.id, locale)).pending : [];
  const product = await publishedProduct(site.firstWorldSlug, locale, user?.id ?? null).catch(() => null);
  const payLink = paypalPaymentLink();
  const order = pending[0];

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-4xl font-semibold">{copy.checkout.title}</h1>
      {!user ? (
        <p className="mt-6 text-mist">
          <Link className="text-action" href={`/${locale}/login`}>
            {copy.auth.loginTitle}
          </Link>
        </p>
      ) : product?.owned ? (
        <p className="mt-6 leading-7 text-mist">
          {copy.checkout.owned}{" "}
          <Link className="text-action" href={`/${locale}/library`}>
            {copy.nav.library}
          </Link>
        </p>
      ) : order && payLink ? (
        <div className="glass mt-8 rounded-3xl p-6">
          <p className="text-sm text-mist">
            {order.orderNo} · {order.title}
          </p>
          <p className="mt-3 text-3xl font-semibold">{order.price}</p>
          <p className="mt-4 leading-7 text-mist">{copy.checkout.payNote}</p>
          <PayPalButton orderId={order.orderId} label={copy.checkout.pay} />
          <p className="mt-4 text-sm leading-6 text-mist">{copy.commerce.paymentClosed}</p>
        </div>
      ) : (
        <p className="mt-6 leading-7 text-mist">
          {copy.checkout.closed}{" "}
          <Link className="text-action" href={`/${locale}/worlds/${site.firstWorldSlug}`}>
            {copy.home.enter}
          </Link>
        </p>
      )}
    </section>
  );
}
