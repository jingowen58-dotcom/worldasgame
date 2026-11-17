export function ClosedForm({
  title,
  note,
  fields,
  action,
}: {
  title: string;
  note: string;
  fields: string[];
  action: string;
}) {
  return (
    <form className="mt-8 max-w-md space-y-4" aria-describedby="closed-note">
      <h1 className="text-3xl">{title}</h1>
      {fields.map((label) => (
        <label key={label} className="block text-sm text-mist">
          {label}
          <input
            disabled
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
          />
        </label>
      ))}
      <button
        type="button"
        disabled
        className="rounded-full bg-action px-5 py-3 text-sm text-ink disabled:opacity-50"
      >
        {action}
      </button>
      <p id="closed-note" className="text-sm leading-6 text-mist">
        {note}
      </p>
    </form>
  );
}
