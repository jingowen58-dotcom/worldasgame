import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-3xl">This page does not exist</h1>
      <p className="mt-4 leading-7 text-mist">The address is not part of World As Game.</p>
      <Link href="/en" className="mt-6 inline-block text-sm text-action">
        Back to home
      </Link>
    </main>
  );
}
