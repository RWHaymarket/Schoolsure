import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  FileText,
  School,
  Facebook,
  Instagram,
} from "lucide-react";

import type { School as SchoolRecord } from "@/types/school";
import { getSchoolLogoUrl } from "@/lib/school-utils";
import SchoolLogo from "@/components/shared/SchoolLogo";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getSchoolBySlug(slug: string) {
  const { data } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data as SchoolRecord | null;
}

function normalizeYearLevel(yearLevelsText: string | null) {
  if (!yearLevelsText) return null;
  const normalized = yearLevelsText.replace(/–/g, "-");
  if (normalized.includes("K-12")) return "K-12";
  if (normalized.includes("7-12")) return "7-12";
  if (normalized.includes("11-12")) return "senior";
  return null;
}

async function getNearbySchools(currentSchool: SchoolRecord, limit = 4) {
  if (
    !currentSchool.latitude ||
    !currentSchool.longitude ||
    !currentSchool.postcode
  ) {
    return [];
  }

  const postcodeNumber = Number.parseInt(currentSchool.postcode, 10);
  if (Number.isNaN(postcodeNumber)) return [];

  const { data: nearbySchools } = await supabase
    .from("schools")
    .select(
      "school_id, school_name, slug, suburb, postcode, sector, gender, year_levels_text, latitude, longitude"
    )
    .neq("school_id", currentSchool.school_id)
    .gte("postcode", String(postcodeNumber - 30))
    .lte("postcode", String(postcodeNumber + 30))
    .limit(50);

  if (!nearbySchools) return [];

  const withDistance = nearbySchools
    .filter((school) => school.latitude && school.longitude)
    .map((school) => ({
      ...school,
      distance: haversineKm(
        currentSchool.latitude!,
        currentSchool.longitude!,
        school.latitude!,
        school.longitude!
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return withDistance;
}

async function getSimilarSchools(
  currentSchool: SchoolRecord,
  excludeSlugs: string[],
  limit = 4
) {
  let query = supabase
    .from("schools")
    .select("school_name, slug, suburb, postcode, sector, gender, year_levels_text")
    .eq("gender", currentSchool.gender)
    .eq("sector", currentSchool.sector)
    .neq("school_id", currentSchool.school_id);

  const yearMatch = normalizeYearLevel(currentSchool.year_levels_text);
  if (yearMatch === "K-12") {
    query = query.or(
      "year_levels_text.ilike.%K–12%,year_levels_text.ilike.%K-12%"
    );
  } else if (yearMatch === "7-12") {
    query = query.or(
      "year_levels_text.ilike.%7–12%,year_levels_text.ilike.%7-12%"
    );
  } else if (yearMatch === "senior") {
    query = query.or(
      "year_levels_text.ilike.%11–12%,year_levels_text.ilike.%11-12%"
    );
  }

  if (excludeSlugs.length > 0) {
    const excludeList = excludeSlugs.map((slug) => `"${slug}"`).join(",");
    query = query.not("slug", "in", `(${excludeList})`);
  }

  const { data } = await query.limit(limit);
  return (data ?? []) as SchoolRecord[];
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Tag({
  children,
  variant,
  sector,
}: {
  children: React.ReactNode;
  variant?: "purple" | "blue";
  sector?: SchoolRecord["sector"];
}) {
  let className = "bg-gray-100 text-gray-600";
  if (variant === "purple") className = "bg-purple-50 text-purple-700";
  if (variant === "blue") className = "bg-blue-50 text-blue-700";
  if (sector === "Independent") className = "bg-blue-50 text-blue-700";
  if (sector === "Catholic") className = "bg-amber-50 text-amber-700";
  if (sector === "Government") className = "bg-gray-100 text-gray-600";

  return (
    <span
      className={`text-sm font-medium px-2.5 py-1 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);

  if (!school) return { title: "School Not Found" };

  return {
    title: `${school.school_name} | ${school.suburb} | ${school.gender} ${school.year_levels_text} | Sydney Schools Tracker`,
    description: `${school.school_name} is ${
      school.sector === "Independent" ? "an" : "a"
    } ${school.sector} ${school.gender.toLowerCase()} school in ${
      school.suburb
    }, NSW. ${school.year_levels_text}. Find fees, contact details, and enrolment info.`,
  };
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const school = await getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  const facts = [
    { label: "Type", value: school.sector },
    { label: "Gender", value: school.gender },
    { label: "Year Levels", value: school.year_levels_text },
    { label: "Boarding", value: school.boarding_school ? "Yes" : "No" },
    school.denomination && { label: "Faith", value: school.denomination },
    school.total_enrolment && {
      label: "Students",
      value: `~${Math.round(school.total_enrolment).toLocaleString()}`,
    },
    school.icsea_value && {
      label: "ICSEA",
      value: Math.round(school.icsea_value),
    },
    school.lga && { label: "LGA", value: school.lga },
    { label: "Postcode", value: school.postcode },
  ].filter(Boolean) as { label: string; value: string | number }[];

  const nearbySchools = await getNearbySchools(school, 4);
  const similarSchools = await getSimilarSchools(
    school,
    nearbySchools.map((item) => item.slug),
    4
  );

  const directionsUrl =
    school.latitude && school.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`
      : null;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-[#F8F9FA] to-white pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/school-directory"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#D6336C] mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to schools
          </Link>

          <div className="flex items-start gap-4">
            <SchoolLogo
              src={getSchoolLogoUrl(school.school_id)}
              alt={`${school.school_name} logo`}
              className="w-14 h-14 rounded-xl shrink-0 bg-white border border-gray-100 object-contain p-1"
            />
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#2D3E50] mb-2">
                {school.school_name}
              </h1>

              <div className="flex items-center gap-2 text-lg text-gray-500 mb-4">
                <MapPin className="w-5 h-5" />
                <span>
                  {school.suburb}, NSW {school.postcode}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Tag sector={school.sector}>{school.sector}</Tag>
                <Tag>{school.gender}</Tag>
                <Tag>{school.year_levels_text}</Tag>
                {school.boarding_school && <Tag variant="purple">Boarding</Tag>}
                {(school.selective_school === "Yes" ||
                  school.selective_school === true) && (
                  <Tag variant="blue">Selective</Tag>
                )}
                {school.denomination && <Tag>{school.denomination}</Tag>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-[#F8F9FA] rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                {fact.label}
              </p>
              <p className="text-lg font-bold text-[#2D3E50]">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {school.sector !== "Government" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-gradient-to-r from-[#2D3E50] to-[#3a5068] rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[#D6336C] text-sm font-semibold mb-1">
                SchoolSure
              </p>
              <h3 className="text-xl font-bold text-white mb-1">
                Protect your child's place at {school.school_name}
              </h3>
              <p className="text-white/50 text-sm">
                If something happens to you, the fees are still paid.
              </p>
            </div>
            <Link
              href={`/quote/school?school=${school.slug}`}
              className="shrink-0 px-6 py-3 bg-[#D6336C] hover:bg-[#C2255C] text-white font-semibold rounded-xl transition-all whitespace-nowrap"
            >
              Get a Quote →
            </Link>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-2xl font-black text-[#2D3E50] mb-5">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D6336C] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-[#2D3E50] font-semibold">
                  {school.street_address}
                </p>
                <p className="text-gray-500">
                  {school.suburb}, NSW {school.postcode}
                </p>
                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    className="text-sm text-[#D6336C] hover:underline mt-2 inline-block"
                  >
                    Get Directions →
                  </a>
                )}
              </div>
            </div>
          </div>

          {school.phone && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D6336C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${school.phone}`}
                    className="text-[#2D3E50] font-semibold hover:text-[#D6336C]"
                  >
                    {school.phone.startsWith("0") ||
                    school.phone.startsWith("(")
                      ? school.phone
                      : `(02) ${school.phone}`}
                  </a>
                </div>
              </div>
            </div>
          )}

          {school.email && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D6336C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${school.email}`}
                    className="text-[#2D3E50] font-semibold hover:text-[#D6336C] break-all"
                  >
                    {school.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {school.website_url && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#D6336C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Website
                  </p>
                  <a
                    href={school.website_url}
                    target="_blank"
                    className="text-[#2D3E50] font-semibold hover:text-[#D6336C] break-all"
                  >
                    {school.website_url
                      .replace(/^https?:\/\/(www\.)?/, "")
                      .replace(/\/$/, "")}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-3">
          {school.fee_page_url && (
            <a
              href={school.fee_page_url}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#2D3E50] hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <DollarSign className="w-4 h-4" /> View Fees
            </a>
          )}
          {school.enrolment_url && (
            <a
              href={school.enrolment_url}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#2D3E50] hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FileText className="w-4 h-4" /> Enrolment Info
            </a>
          )}
          {school.tours_url && (
            <a
              href={school.tours_url}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#2D3E50] hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <School className="w-4 h-4" /> Book a Tour
            </a>
          )}
          {school.latest_reports_url && (
            <a
              href={school.latest_reports_url}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#2D3E50] hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FileText className="w-4 h-4" /> Annual Report
            </a>
          )}
        </div>

        {(school.facebook_url || school.instagram_url) && (
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-400">Follow:</span>
            {school.facebook_url && (
              <a
                href={`https://facebook.com/${school.facebook_url}`}
                target="_blank"
                className="text-gray-400 hover:text-blue-600"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {school.instagram_url && (
              <a
                href={`https://instagram.com/${school.instagram_url.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                className="text-gray-400 hover:text-pink-500"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </section>

      {school.extra_campuses && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-[#2D3E50] mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Campus Locations
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {school.extra_campuses}
            </p>
          </div>
        </section>
      )}

      {school.latitude && school.longitude && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="rounded-2xl overflow-hidden h-64 lg:h-80 border border-gray-100">
            <iframe
              src={`https://www.google.com/maps?q=${school.latitude},${school.longitude}&z=15&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              title={`Map showing ${school.school_name} location`}
            />
          </div>
        </section>
      )}

      {nearbySchools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h2 className="text-2xl font-black text-[#2D3E50] mb-2">
            Nearby Schools
          </h2>
          <p className="text-gray-500 mb-5">
            Schools close to {school.school_name}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {nearbySchools.map((nearby) => (
              <Link
                href={`/school/${nearby.slug}`}
                key={nearby.slug}
                className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#2D3E50] group-hover:text-[#D6336C] transition-colors">
                      {nearby.school_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {nearby.suburb} · {nearby.gender} ·{" "}
                      {nearby.year_levels_text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {nearby.sector}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#D6336C] shrink-0 ml-4">
                    {nearby.distance < 1
                      ? `${(nearby.distance * 1000).toFixed(0)}m`
                      : `${nearby.distance.toFixed(1)}km`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {similarSchools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h2 className="text-2xl font-black text-[#2D3E50] mb-2">
            Similar Schools
          </h2>
          <p className="text-gray-500 mb-5">
            {school.sector}{" "}
            {school.gender.toLowerCase() !== "coed"
              ? `${school.gender.toLowerCase()}'`
              : ""}
            schools like {school.school_name}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {similarSchools.map((similar) => (
              <Link
                href={`/school/${similar.slug}`}
                key={similar.slug}
                className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all"
              >
                <h3 className="font-bold text-[#2D3E50] group-hover:text-[#D6336C] transition-colors">
                  {similar.school_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {similar.suburb}, NSW {similar.postcode}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {similar.sector} · {similar.gender} ·{" "}
                  {similar.year_levels_text}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {school.sector !== "Government" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-[#2D3E50] to-[#3a5068] rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Investing in their education?
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              SchoolSure protects your school fees if something happens to you.
              Your child stays at {school.school_name}. Get covered for less
              than the cost of a coffee a day.
            </p>
            <Link
              href={`/quote/school?school=${school.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D6336C] hover:bg-[#C2255C] text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-[#D6336C]/30"
            >
              Get a Quote for {school.school_name} →
            </Link>
            <p className="text-sm text-white/30 mt-4">
              60 seconds · No paperwork · Cancel anytime
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
