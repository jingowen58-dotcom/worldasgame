import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceOrderButton } from "@/components/PlaceOrderButton";
import { getCopy } from "@/lib/copy";
import { site } from "@/lib/site";
import { readLocale } from "@/lib/read-locale";
import { publishedProduct } from "@/server/commerce";
import { currentUser } from "@/server/session";

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: localeValue } = await params;
  const locale = await readLocale(Promise.resolve({ locale: localeValue }));
  const copy = getCopy(locale);
  if (slug !== site.firstWorldSlug) notFound();

  const user = await currentUser().catch(() => null);
  const product = await publishedProduct(slug, locale, user?.id ?? null).catch(() => null);

  return (
    <article>
      <section className="relative min-h-[52vh] overflow-hidden">
        <img src="/story-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/55 to-[#070b16]/20" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-5 pb-10">
          <p className="text-xs tracking-[0.16em] text-[#d8c7ff] uppercase">{copy.home.featured}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-6xl">{copy.home.flagshipTitle}</h1>
          <p className="mt-4 max-w-xl leading-7 text-mist">{copy.home.flagshipBody}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <ul className="flex flex-wrap gap-3 text-sm text-mist">
            {copy.home.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-white/10 px-3 py-1">
                {chip}
              </li>
            ))}
            {product ? <li className="rounded-full border border-white/10 px-3 py-1">{product.price}</li> : null}
          </ul>
          <h2 className="mt-10 text-2xl font-semibold">{copy.world.episodes}</h2>
          <ol className="mt-4 divide-y divide-white/10 rounded-3xl border border-white/10">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <span>{locale === "zh" ? `第 ${index + 1} 集` : `Episode ${index + 1}`}</span>
                <span className="text-xs tracking-[0.14em] text-mist uppercase">
                  {index === 0 ? copy.world.preview : copy.world.locked}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-mist">{copy.commerce.storyClosed}</p>
        </div>
        <aside className="glass h-fit rounded-3xl p-6">
          <p className="text-sm text-mist">{product ? product.price : copy.common.comingSoon}</p>
          <h2 className="mt-2 text-2xl">{copy.home.flagshipTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-mist">{copy.home.flagshipBody}</p>
          {product?.owned ? (
            <Link href={`/${locale}/library`} className="btn-glow mt-6 inline-flex rounded-full px-5 py-3 text-sm text-white">
              {copy.commerce.inLibrary}
            </Link>
          ) : product && user ? (
            <PlaceOrderButton productId={product.id} locale={locale} copy={copy} />
          ) : (
            <Link href={`/${locale}/login`} className="btn-glow mt-6 inline-flex rounded-full px-5 py-3 text-sm text-white">
              {copy.commerce.loginToOrder}
            </Link>
          )}
        </aside>
      </section>
    </article>
  );
}
