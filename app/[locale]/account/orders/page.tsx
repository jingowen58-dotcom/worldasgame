import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";
import { ordersForUser } from "@/server/commerce";
import { currentUser } from "@/server/session";

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const user = await currentUser();
  if (!user) {
    return (
      <p className="text-mist">
        {copy.account.signedOut}{" "}
        <Link className="text-action" href={`/${locale}/login`}>
          {copy.auth.loginTitle}
        </Link>
      </p>
    );
  }
  const orders = await ordersForUser(user.id, locale);
  if (orders.length === 0) return <p className="text-mist">{copy.library.empty}</p>;

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.orderNo} className="rounded-2xl border border-line p-4">
          <p className="text-sm text-mist">{order.orderNo}</p>
          <p className="mt-1">{order.title}</p>
          <p className="mt-1 text-sm text-mist">
            {order.price} · {copy.orderStatus[order.status as keyof typeof copy.orderStatus] ?? order.status}
          </p>
          {order.status === "PENDING" || order.status === "PAYMENT_PROCESSING" ? (
            <Link href={`/${locale}/checkout`} className="mt-2 inline-block text-sm text-action">
              {copy.checkout.pay}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
