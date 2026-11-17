import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";
import { libraryFor } from "@/server/commerce";
import { currentUser } from "@/server/session";

export default async function LibraryPage({ params }: { params: Promise<{ locale: string }> }) {
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
  const library = await libraryFor(user.id, locale);
  if (library.owned.length === 0 && library.pending.length === 0) {
    return (
      <section>
        <h1 className="text-4xl">{copy.library.title}</h1>
        <p className="mt-4 text-mist">{copy.library.empty}</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <h1 className="text-4xl">{copy.library.title}</h1>
      {library.owned.length > 0 ? (
        <ul className="space-y-3">
          {library.owned.map((item) => (
            <li key={item.slug} className="rounded-2xl border border-line bg-panel p-5">
              <p className="text-xs tracking-[0.16em] text-mist uppercase">{copy.library.owned}</p>
              <h2 className="mt-2 text-2xl">{item.title}</h2>
            </li>
          ))}
        </ul>
      ) : null}
      {library.pending.length > 0 ? (
        <ul className="space-y-3">
          {library.pending.map((item) => (
            <li key={item.orderNo} className="rounded-2xl border border-line p-5">
              <p className="text-xs tracking-[0.16em] text-mist uppercase">{copy.library.pending}</p>
              <h2 className="mt-2 text-2xl">{item.title}</h2>
              <p className="mt-2 text-mist">{item.price}</p>
              <p className="mt-2 text-sm text-mist">{copy.library.notUnlocked}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
