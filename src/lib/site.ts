import { getEntry, type CollectionEntry } from "astro:content";

export async function getSiteProfile(): Promise<CollectionEntry<"site">> {
  const profile = await getEntry("site", "profile");

  if (!profile) {
    throw new Error("The required site profile entry is missing.");
  }

  return profile;
}
