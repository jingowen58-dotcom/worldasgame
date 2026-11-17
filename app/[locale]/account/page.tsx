import { redirect } from "next/navigation";
import { readLocale } from "@/lib/read-locale";

export default async function AccountIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  redirect(`/${locale}/account/profile`);
}
