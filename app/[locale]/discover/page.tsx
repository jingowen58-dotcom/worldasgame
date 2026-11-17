import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { site } from "@/lib/site";
import { readLocale } from "@/lib/read-locale";
import { publishedProduct } from "@/server/commerce";
import { currentUser } from "@/server/session";

export default async function DiscoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const user = await currentUser().catch(() => null);
  const product = await publishedProduct(site.firstWorldSlug, locale, user?.id ?? null).catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-[#d8c7ff] uppercase">{copy.nav.discover}</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{copy.home.flagshipTitle}</h1>
      <p className="mt-4 max-w-xl leading-7 text-mist">{copy.discover.lead}</p>
      <Link
        href={`/${locale}/worlds/${site.firstWorldSlug}`}
        className="glass mt-10 grid overflow-hidden rounded-3xl md:grid-cols-[1.1fr_1fr]"
      >
        <img src="/story-poster.jpg" alt="" className="h-64 w-full object-cover md:h-full" />
        <div className="p-6 sm:p-8">
          <p className="text-xs tracking-[0.16em] text-[#d8c7ff] uppercase">{copy.home.featured}</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.home.flagshipTitle}</h2>
          <p className="mt-3 leading-7 text-mist">{copy.home.flagshipBody}</p>
          <p className="mt-4 text-sm text-mist">{product ? product.price : copy.common.comingSoon}</p>
          <span className="btn-glow mt-6 inline-flex rounded-full px-5 py-2.5 text-sm text-white">
            {copy.home.start}
          </span>
        </div>
      </Link>
    </div>
  );
}
