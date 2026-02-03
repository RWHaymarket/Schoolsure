"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getSchoolLogoUrl } from "@/lib/school-utils";
import type { School } from "@/types/school";

const PAGE_SIZE = 50;
const sectors = ["All", "Independent", "Catholic", "Government"] as const;
const genders = ["All", "Coed", "Girls", "Boys"] as const;
const yearLevels = [
  { label: "All", value: "All" },
  { label: "K–12", value: "K-12" },
  { label: "7–12", value: "7-12" },
  { label: "Senior (11-12)", value: "senior" },
] as const;
const areas = [
  { label: "All Areas", value: "" },
  { label: "── Sydney Metro ──", value: "", disabled: true },
  { label: "Sydney City", value: "Sydney" },
  { label: "Inner West", value: "Inner West" },
  { label: "Eastern Suburbs", value: "Randwick" },
  { label: "North Shore", value: "North Sydney" },
  { label: "Upper North Shore", value: "Ku-ring-gai" },
  { label: "Hornsby", value: "Hornsby" },
  { label: "Northern Beaches", value: "Northern Beaches" },
  { label: "Hills District", value: "The Hills Shire" },
  { label: "Parramatta", value: "Parramatta" },
  { label: "Canterbury-Bankstown", value: "Canterbury-Bankstown" },
  { label: "Sutherland Shire", value: "Sutherland" },
  { label: "Georges River", value: "Georges River" },
  { label: "── Greater Sydney ──", value: "", disabled: true },
  { label: "Blacktown", value: "Blacktown" },
  { label: "Penrith", value: "Penrith" },
  { label: "Liverpool", value: "Liverpool" },
  { label: "Campbelltown", value: "Campbelltown" },
  { label: "Camden", value: "Camden" },
  { label: "Blue Mountains", value: "Blue Mountains" },
  { label: "Central Coast", value: "Central Coast" },
  { label: "── Regional NSW ──", value: "", disabled: true },
  { label: "Newcastle", value: "Newcastle" },
  { label: "Lake Macquarie", value: "Lake Macquarie" },
  { label: "Wollongong", value: "Wollongong" },
  { label: "Maitland", value: "Maitland" },
] as const;
const sortOptions = [
  { label: "Name A–Z", value: "name-asc" },
  { label: "Name Z–A", value: "name-desc" },
  { label: "Suburb A–Z", value: "suburb-asc" },
] as const;

type DirectorySort = (typeof sortOptions)[number]["value"];

export function SchoolDirectoryListing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [schools, setSchools] = useState<School[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const sector = searchParams.get("sector") ?? "All";
  const area = searchParams.get("area") ?? "";
  const gender = searchParams.get("gender") ?? "All";
  const yearLevel = searchParams.get("year") ?? "All";
  const boardingOnly = searchParams.get("boarding") === "true";
  const sortBy = (searchParams.get("sort") ?? "name-asc") as DirectorySort;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const searchQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParams({ q: searchInput || null, page: "1" });
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput, searchQuery]);

  useEffect(() => {
    let isActive = true;
    const fetchSchools = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("schools")
        .select(
          "school_id, school_name, slug, sector, gender, year_levels_text, suburb, postcode, lga, boarding_school",
          { count: "exact" }
        );

      if (searchQuery) {
        query = query.or(
          `school_name.ilike.%${searchQuery}%,suburb.ilike.%${searchQuery}%`
        );
      }

      if (sector !== "All") {
        query = query.eq("sector", sector);
      }

      if (area) {
        query = query.ilike("lga", `%${area}%`);
      }

      if (gender !== "All") {
        query = query.eq("gender", gender);
      }

      if (yearLevel === "K-12") {
        query = query.or(
          "year_levels_text.ilike.%K–12%,year_levels_text.ilike.%K-12%"
        );
      } else if (yearLevel === "7-12") {
        query = query.or(
          "year_levels_text.ilike.%7–12%,year_levels_text.ilike.%7-12%"
        );
      } else if (yearLevel === "senior") {
        query = query.or(
          "year_levels_text.ilike.%11–12%,year_levels_text.ilike.%11-12%"
        );
      }

      if (boardingOnly) {
        query = query.eq("boarding_school", true);
      }

      if (sortBy === "name-desc") {
        query = query.order("school_name", { ascending: false });
      } else if (sortBy === "suburb-asc") {
        query = query.order("suburb", { ascending: true }).order("school_name");
      } else {
        query = query.order("school_name", { ascending: true });
      }

      const { data, count } = await query.range(from, to);

      if (!isActive) return;

      setSchools((data as School[]) ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    fetchSchools();
    return () => {
      isActive = false;
    };
  }, [searchQuery, sector, area, gender, yearLevel, boardingOnly, sortBy, page]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    [totalCount]
  );
  const showingFrom = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, totalCount);

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <section className="pt-12 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-black text-[#2D3E50] mb-1">
            Find a School
          </h1>
          <p className="text-gray-500 mb-6">
            Browse 796 schools across NSW
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by school name..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6336C]"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-400 mb-3">Filters:</p>
            <div className="flex flex-wrap gap-3">
              <select
                value={sector}
                onChange={(event) =>
                  updateParams({ sector: event.target.value, page: "1" })
                }
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#2D3E50]"
              >
                {sectors.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={area}
                onChange={(event) =>
                  updateParams({ area: event.target.value || null, page: "1" })
                }
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#2D3E50]"
              >
                {areas.map((option) => (
                  <option
                    key={`${option.label}-${option.value}`}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={gender}
                onChange={(event) =>
                  updateParams({ gender: event.target.value, page: "1" })
                }
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#2D3E50]"
              >
                {genders.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={yearLevel}
                onChange={(event) =>
                  updateParams({ year: event.target.value, page: "1" })
                }
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#2D3E50]"
              >
                {yearLevels.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-sm text-[#2D3E50]">
                <input
                  type="checkbox"
                  checked={boardingOnly}
                  onChange={(event) =>
                    updateParams({
                      boarding: event.target.checked ? "true" : null,
                      page: "1",
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#D6336C] focus:ring-[#D6336C]"
                />
                Boarding only
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <span>
              Showing {showingFrom}–{showingTo} of {totalCount} schools
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  updateParams({ sort: event.target.value, page: "1" })
                }
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#2D3E50]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  <div className="h-5 w-12 bg-gray-100 rounded-full" />
                  <div className="h-5 w-20 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-lg font-semibold text-[#2D3E50] mb-2">
              No schools found
            </p>
            <p className="text-gray-500 mb-4">
              Try clearing filters or searching again.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-[#2D3E50] text-white rounded-lg text-sm font-semibold hover:bg-[#223241] transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <Link
                href={`/school/${school.slug}`}
                key={school.school_id}
                className="group"
              >
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <img
                      src={getSchoolLogoUrl(school.school_id)}
                      alt=""
                      className="w-8 h-8 rounded-md mt-0.5 shrink-0 bg-gray-50 object-contain"
                      onError={(event) => {
                        (event.target as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#2D3E50] group-hover:text-[#D6336C] transition-colors mb-1">
                        {school.school_name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {school.suburb}, NSW {school.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        school.sector === "Independent"
                          ? "bg-blue-50 text-blue-700"
                          : school.sector === "Catholic"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {school.sector}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {school.gender}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {school.year_levels_text}
                    </span>
                    {school.boarding_school === true && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                        Boarding
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {schools.length > 0 && !loading && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                updateParams({ page: String(Math.max(1, page - 1)) })
              }
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-[#2D3E50] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                updateParams({ page: String(Math.min(pageCount, page + 1)) })
              }
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-[#2D3E50] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}

        <div className="bg-[#2D3E50] rounded-2xl p-8 lg:p-12 text-center mt-12">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
            Found the right school?
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-6">
            Protect your child's place with SchoolSure. If something happens to you, the fees are still paid.
          </p>
          <a
            href="/quote/school"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#D6336C] hover:bg-[#C2255C] text-white font-semibold rounded-xl transition-all"
          >
            Get a Quote →
          </a>
        </div>
      </section>
    </div>
  );
}
