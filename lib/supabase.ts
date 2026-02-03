import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSchoolLogoUrl(schoolId: string): string {
  return `${supabaseUrl}/storage/v1/object/public/school-logos/${schoolId}.png`;
}
