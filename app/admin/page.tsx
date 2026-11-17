import Link from "next/link";
import { AdminForms } from "@/components/AdminForms";
import { ConfirmOrderButton } from "@/components/ConfirmOrderButton";
import { RevokeButton } from "@/components/RevokeButton";
import { getCopy } from "@/lib/copy";
import { listEvents, orderNoFromMetadata } from "@/server/analytics";
import { listErrors } from "@/server/errors";
import { isAdminEmail } from "@/server/admin";
import { listAuditLogs, listOpenOrders, listProducts, listUsers } from "@/server/commerce";
import { formatMinor } from "@/server/money";
import { listEmailLogs } from "@/server/mail";
import { currentUser } from "@/server/session";

export default async function AdminPage() {
  const copy = getCopy("en");
  const user = await currentUser().catch(() => null);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16">
      <p className="text-xs tracking-[0.16em] text-mist uppercase">World As Game</p>
      <h1 className="mt-3 text-4xl">{copy.admin.title}</h1>
      {!user ? (
        <p className="mt-4 text-mist">
          {copy.admin.login}{" "}
          <Link className="text-action" href="/en/login">
            {copy.auth.loginTitle}
          </Link>
        </p>
      ) : !isAdminEmail(user.email) ? (
        <p className="mt-4 text-mist">{copy.admin.closed}</p>
      ) : (
        <>
          <p className="mt-4 max-w-xl leading-7 text-mist">{copy.admin.body}</p>
          <h2 className="mt-10 text-2xl">{copy.admin.eventLog}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(await listEvents()).map((event, index) => (
              <li key={`${index}-${event.created_at}-${event.event_type}`}>
                {new Date(event.created_at).toLocaleString("en")}
                {" · "}
                {copy.admin.eventLabels[event.event_type as keyof typeof copy.admin.eventLabels] ?? event.event_type}
                {event.email ? ` · ${event.email}` : ""}
                {orderNoFromMetadata(event.metadata) ? ` · ${orderNoFromMetadata(event.metadata)}` : ""}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{copy.admin.auditLog}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(await listAuditLogs()).map((entry) => (
              <li key={entry.id}>
                {new Date(entry.created_at).toLocaleString("en")}
                {" · "}
                {copy.admin.auditLabels[entry.action as keyof typeof copy.admin.auditLabels] ?? entry.action}
                {` · ${entry.actor_email}`}
                {entry.order_no ? ` · ${entry.order_no}` : ""}
                {entry.product_slug ? ` · ${entry.product_slug}` : ""}
                {entry.target_email ? ` · ${entry.target_email}` : ""}
                {entry.reason ? ` · ${entry.reason}` : ""}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{copy.admin.errorLog}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(await listErrors()).map((entry) => (
              <li key={entry.id}>
                {new Date(entry.created_at).toLocaleString("en")}
                {" · "}
                {copy.admin.errorLabels[entry.error_type as keyof typeof copy.admin.errorLabels] ?? entry.error_type}
                {` · ${entry.code}`}
                {entry.message ? ` · ${entry.message}` : ""}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{copy.admin.users}</h2>
          <ul className="mt-4 space-y-3">
            {(await listUsers()).map((person) => (
              <li key={`${person.email}-${person.entitlement_id ?? "none"}`} className="rounded-2xl border border-white/10 p-4 text-sm">
                <p>{person.email}</p>
                <p className="mt-1 text-mist">
                  {person.status}
                  {person.entitlement_id
                    ? ` · ${copy.admin.access}${person.product_title ? `: ${person.product_title}` : ""}`
                    : ` · ${copy.admin.noAccess}`}
                </p>
                {person.entitlement_id ? (
                  <div className="mt-3">
                    <RevokeButton entitlementId={person.entitlement_id} label={copy.admin.revoke} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{copy.admin.orders}</h2>
          <ul className="mt-4 space-y-3">
            {(await listOpenOrders()).map((order) => (
              <li key={order.id} className="rounded-2xl border border-white/10 p-4 text-sm">
                <p>
                  {order.order_no} · {order.email}
                </p>
                <p className="mt-1 text-mist">
                  {order.title} · {formatMinor(Number(order.total_minor), order.currency, "en")} · {order.status}
                </p>
                {order.status !== "PAID" ? (
                  <div className="mt-3">
                    <ConfirmOrderButton
                      orderId={order.id}
                      label={copy.admin.confirm}
                      doneLabel={copy.admin.confirmed}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{copy.admin.mailLog}</h2>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            {(await listEmailLogs()).map((mail) => (
              <li key={`${mail.created_at}-${mail.to_address}-${mail.template}`}>
                {mail.template} · {mail.to_address} ·{" "}
                {mail.status === "sent"
                  ? copy.admin.mailSent
                  : mail.status === "failed"
                    ? copy.admin.mailFailed
                    : copy.admin.mailLogged}
              </li>
            ))}
          </ul>
          <AdminForms
            copy={copy}
            products={(await listProducts()).map((product) => ({
              id: product.id,
              slug: product.slug,
              title: `${product.title} · ${formatMinor(Number(product.amount_minor), "USD", "en")}`,
            }))}
          />
        </>
      )}
      <Link href="/en" className="mt-10 inline-block text-sm text-action">
        {copy.admin.home}
      </Link>
    </main>
  );
}
