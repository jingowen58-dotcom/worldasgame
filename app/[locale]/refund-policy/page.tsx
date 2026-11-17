import { DraftPage } from "@/components/DraftPage";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function RefundPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  return (
    <DraftPage title={copy.pages.refundTitle} paragraphs={copy.pages.refundBody} notice={copy.common.draftNotice} />
  );
}
