export function getSchoolLogoUrl(schoolId: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/school-logos/${schoolId}.png`;
}
