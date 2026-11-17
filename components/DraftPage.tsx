export function DraftPage({
  title,
  paragraphs,
  notice,
}: {
  title: string;
  paragraphs: string[];
  notice: string;
}) {
  return (
    <article className="max-w-xl">
      <h1 className="text-4xl">{title}</h1>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-7 text-mist">
          {paragraph}
        </p>
      ))}
      <p className="mt-8 text-sm text-mist">{notice}</p>
    </article>
  );
}
