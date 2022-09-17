import getSlug from "speakingurl";

export default function generateSlug(text: string): string {
  return getSlug(text, { lang: "tr" });
}
