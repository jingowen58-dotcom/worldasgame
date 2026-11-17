import { StatusPanel } from "@/components/StatusPanel";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  return <StatusPanel title={copy.checkout.successTitle} body={copy.checkout.successBody} />;
}
