import type { CollectionEntry } from "astro:content";

export function isPublicWork(entry: CollectionEntry<"work">) {
  return entry.data.approvalStatus === "approved" && entry.data.confidentialityReview;
}
