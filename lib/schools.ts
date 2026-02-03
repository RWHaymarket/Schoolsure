import { supabase } from "./supabase";
import type { School } from "@/types/school";

export async function getSchoolBySlug(slug?: string | null): Promise<School | null> {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();

  const { data } = await supabase
    .from("schools")
    .select("*")
    .or(`slug.eq.${normalized},slug.ilike.%${normalized}%`)
    .maybeSingle();

  if (data) return data as School;
  const fallbackName = normalized.replace(/-/g, " ");
  const { data: fallbackData } = await supabase
    .from("schools")
    .select("*")
    .ilike("school_name", `%${fallbackName}%`)
    .limit(1)
    .maybeSingle();

  return fallbackData ? (fallbackData as School) : null;
}

export async function getAllSchoolSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("schools")
    .select("slug")
    .not("slug", "is", null);

  if (error || !data) return [];
  return data.map((s: { slug: string }) => s.slug).filter(Boolean);
}

export async function getSimilarSchools(school: School, limit = 4): Promise<School[]> {
  const { data, error } = await supabase
    .from("schools")
    .select(
      "school_id, school_name, slug, sector, denomination, gender, year_levels_text, suburb, postcode, icsea_value, fee_page_url"
    )
    .neq("school_id", school.school_id)
    .or(`lga.eq.${school.lga},suburb.eq.${school.suburb}`)
    .limit(limit);

  if (error || !data) return [];
  return data as School[];
}

export async function getSchoolById(schoolId: string): Promise<School | null> {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("school_id", schoolId)
    .single();

  if (error || !data) return null;
  return data as School;
}

export async function getNearbySchools(school: School, limit = 4): Promise<(School & { distance_km: number })[]> {
  if (!school.latitude || !school.longitude) return [];
  const { data, error } = await supabase
    .from("schools")
    .select(
      "school_id, school_name, slug, sector, gender, year_levels_text, suburb, state, postcode, latitude, longitude"
    )
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error || !data) return [];

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const lat1 = school.latitude;
  const lon1 = school.longitude;

  const withDistance = (data as School[])
    .filter((item) => item.school_id !== school.school_id && item.slug)
    .map((item) => {
      const lat2 = item.latitude ?? 0;
      const lon2 = item.longitude ?? 0;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c;
      return { ...item, distance_km: distance };
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  return withDistance;
}

export async function getSimilarProfileSchools(
  school: School,
  limit = 4
): Promise<School[]> {
  const { data, error } = await supabase
    .from("schools")
    .select(
      "school_id, school_name, slug, sector, denomination, gender, year_levels_text, suburb, state, postcode, icsea_value"
    )
    .not("slug", "is", null)
    .neq("school_id", school.school_id);

  if (error || !data) return [];

  const normalize = (value?: string | null) => (value || "").toLowerCase();
  const targetGender = normalize(school.gender);
  const targetSector = normalize(school.sector);
  const targetYears = normalize(school.year_levels_text);
  const targetDenomination = normalize(school.denomination);
  const targetIcsea = school.icsea_value;

  const scored = (data as School[])
    .filter((candidate) => candidate.slug)
    .map((candidate) => {
      let score = 0;
      if (normalize(candidate.gender) === targetGender) score += 3;
      if (normalize(candidate.sector) === targetSector) score += 3;
      if (normalize(candidate.year_levels_text) === targetYears) score += 2;
      if (targetDenomination && normalize(candidate.denomination) === targetDenomination)
        score += 1;
      if (
        targetIcsea &&
        candidate.icsea_value &&
        Math.abs(candidate.icsea_value - targetIcsea) <= 100
      )
        score += 1;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.candidate)
    .slice(0, limit);

  return scored;
}
