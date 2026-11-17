import { StatusPanel } from "@/components/StatusPanel";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  return <StatusPanel title={copy.checkout.cancelTitle} body={copy.checkout.cancelBody} />;
}
