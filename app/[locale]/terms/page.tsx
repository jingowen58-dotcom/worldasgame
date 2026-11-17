import { DraftPage } from "@/components/DraftPage";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  return <DraftPage title={copy.pages.termsTitle} paragraphs={copy.pages.termsBody} notice={copy.common.draftNotice} />;
}
