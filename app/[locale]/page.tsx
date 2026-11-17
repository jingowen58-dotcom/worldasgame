import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";
import { publishedProduct } from "@/server/commerce";
import { currentUser } from "@/server/session";
import { site } from "@/lib/site";

const stepIcons = ["▶", "☝", "⌖", "✦", "🏆"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const worldHref = `/${locale}/worlds/${site.firstWorldSlug}`;
  const user = await currentUser().catch(() => null);
  const product = await publishedProduct(site.firstWorldSlug, locale, user?.id ?? null).catch(() => null);

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="/hero-portal.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b16] via-[#070b16]/80 to-transparent" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-5 py-16">
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {copy.home.heroA}
            <span className="mt-2 block bg-gradient-to-r from-[#c4b5ff] to-[#e9d5ff] bg-clip-text text-transparent">
              {copy.home.heroB}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-mist">{copy.home.lead}</p>
          <Link
            href={worldHref}
            className="btn-glow mt-8 inline-flex w-fit items-center gap-3 rounded-full px-6 py-3 text-sm font-medium text-white"
          >
            <span aria-hidden>▶</span>
            {copy.home.enter}
          </Link>
          <p className="mt-8 text-xs tracking-[0.14em] text-mist uppercase">{copy.home.scroll}</p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-5">
        <div className="glass grid overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_1.2fr_0.7fr]">
          <img src="/story-poster.jpg" alt="" className="h-64 w-full object-cover lg:h-full" />
          <div className="p-6 sm:p-8">
            <p className="text-xs tracking-[0.16em] text-[#d8c7ff] uppercase">{copy.home.featured}</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.home.flagshipTitle}</h2>
            <p className="mt-3 max-w-md leading-7 text-mist">{copy.home.flagshipBody}</p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-mist">
              {copy.home.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
              {product ? <li>{product.price}</li> : null}
            </ul>
            <Link
              href={worldHref}
              className="btn-glow mt-6 inline-flex rounded-full px-5 py-2.5 text-sm text-white"
            >
              {copy.home.start}
            </Link>
          </div>
          <ul className="grid gap-3 p-4">
            {copy.home.clips.map((clip, index) => (
              <li key={clip} className="flex items-center gap-3 rounded-2xl bg-white/5 p-2">
                <img
                  src={index === 0 ? "/hero-portal.jpg" : "/story-poster.jpg"}
                  alt=""
                  className="h-14 w-24 rounded-xl object-cover"
                />
                <span className="text-sm">{clip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-3xl font-semibold">{copy.home.howTitle}</h2>
          <p className="mt-4 max-w-sm leading-7 text-mist">{copy.home.howLead}</p>
          <Link href={`/${locale}/about`} className="mt-5 inline-block text-sm text-[#c4b5ff]">
            {copy.home.learnMore}
          </Link>
        </div>
        <ol className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {copy.home.steps.map((step, index) => (
            <li key={step.title} className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#7d6bff]/50 bg-[#7d6bff]/15 text-lg">
                {stepIcons[index] ?? "•"}
              </div>
              <h3 className="mt-3 text-sm">{step.title}</h3>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(circle_at_center,#1d4ed8_0%,transparent_68%)] opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">{copy.home.realityTitle}</h2>
            <p className="mt-4 max-w-md leading-7 text-mist">{copy.home.realityBody}</p>
            <Link
              href={`/${locale}/about`}
              className="btn-glow mt-6 inline-flex rounded-full px-5 py-3 text-sm text-white"
            >
              {copy.home.aboutCta}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["/hero-portal.jpg", "/story-poster.jpg", "/hero-portal.jpg"].map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt=""
                className="h-36 w-full rounded-2xl object-cover shadow-2xl"
              />
            ))}
          </div>
          <Link href={`/${locale}/discover`} className="text-sm text-mist lg:col-start-2 lg:justify-self-end">
            {copy.home.exploreMore}
          </Link>
        </div>
      </section>
    </div>
  );
}
