export function StatusPanel({
  eyebrow,
  title,
  body,
  heading = "h1",
}: {
  eyebrow?: string;
  title: string;
  body: string;
  heading?: "h1" | "h2";
}) {
  const Title = heading;
  return (
    <section className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      {eyebrow ? <p className="text-xs tracking-[0.16em] text-mist uppercase">{eyebrow}</p> : null}
      <Title className="mt-3 text-3xl text-paper sm:text-4xl">{title}</Title>
      <p className="mt-4 max-w-xl text-base leading-7 text-mist">{body}</p>
    </section>
  );
}
