"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Facebook,
  Globe,
  Heart,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Share2,
  Star,
} from "lucide-react";

import { getSchoolLogoUrl } from "@/lib/school-utils";
import type { School } from "@/types/school";

interface SchoolProfilePageProps {
  school: School;
  nearbySchools: Array<School & { distance_km: number }>;
  similarSchools: School[];
}

const formatYesNo = (value?: boolean | "Yes" | "No" | null) => {
  if (value === true || value === "Yes") return "Yes";
  if (value === false || value === "No") return "No";
  return null;
};

export function SchoolProfilePage({
  school,
  nearbySchools,
  similarSchools,
}: SchoolProfilePageProps) {
  const quoteUrl = `/quote/school?school=${encodeURIComponent(
    school.school_name
  )}&id=${school.school_id}`;

  const tags: string[] = [
    school.sector,
    school.gender,
    school.year_levels_text,
  ];
  if (school.boarding_school) tags.push("Boarding");
  if (formatYesNo(school.selective_school) === "Yes") tags.push("Selective");
  if (school.denomination) tags.push(school.denomination);

  const snapshotItems = [
    { label: "Type", value: school.sector },
    { label: "Gender", value: school.gender },
    { label: "Year Levels", value: school.year_levels_text },
    { label: "Boarding", value: formatYesNo(school.boarding_school) },
    { label: "Faith", value: school.denomination },
    {
      label: "Students",
      value: school.total_enrolment ? `~${school.total_enrolment.toLocaleString()}` : null,
    },
    { label: "Selective", value: formatYesNo(school.selective_school) === "Yes" ? "Yes" : null },
    { label: "ICSEA", value: school.icsea_value ? String(school.icsea_value) : null },
    { label: "LGA", value: school.lga },
  ].filter((item) => item.value);

  const directionsUrl =
    school.latitude && school.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`
      : null;

  const isGovernment = school.sector === "Government";

  const crossSellCopy =
    school.sector === "Catholic"
      ? `Keep your child at ${school.school_name}, whatever happens`
      : `Protect your child's place at ${school.school_name}`;

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-grey-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <Link
            href="/school-directory"
            className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-navy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to schools
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-xl bg-white border border-grey-300 shadow-sm flex items-center justify-center overflow-hidden mb-4">
                <Image
                  src={getSchoolLogoUrl(school.school_id)}
                  alt={`${school.school_name} logo`}
                  width={56}
                  height={56}
                  className="object-contain"
                  onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy mb-2">
                {school.school_name}
              </h1>
              <div className="flex items-center gap-2 text-grey-700 mb-4">
                <MapPin className="w-4 h-4 text-grey-500" />
                <span>
                  {school.suburb}, {school.state} {school.postcode}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-grey-100 text-grey-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-grey-500">
                <button type="button" className="inline-flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Save
                </button>
                <button type="button" className="inline-flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Compare
                </button>
                <button type="button" className="inline-flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {snapshotItems.map((item) => (
            <div key={item.label} className="bg-grey-100 rounded-xl p-5">
              <p className="text-xs text-grey-500 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg font-bold text-navy">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {!isGovernment ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-gradient-to-r from-navy to-[#3a4f65] rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">SchoolSure</p>
              <h3 className="text-white text-xl font-bold mb-1">{crossSellCopy}</h3>
              <p className="text-white/50 text-sm">
                If something happens to you, the fees are still paid.
              </p>
            </div>
            <Link
              href={quoteUrl}
              className="shrink-0 px-6 py-3 bg-magenta hover:bg-magenta-dark text-white font-semibold rounded-xl transition-all"
            >
              Get a Quote →
            </Link>
          </div>
        </section>
      ) : null}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {school.street_address || school.suburb ? (
            <div className="bg-white rounded-2xl border border-grey-300 p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-magenta" />
                <div>
                  <p className="font-semibold text-navy">Address</p>
                  <p className="text-grey-700 text-sm">
                    {school.street_address ? (
                      <>
                        {school.street_address}
                        <br />
                      </>
                    ) : null}
                    {school.suburb}, {school.state} {school.postcode}
                  </p>
                </div>
              </div>
              {directionsUrl ? (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-magenta font-semibold text-sm inline-flex items-center gap-2"
                >
                  Get Directions ↗
                </a>
              ) : null}
            </div>
          ) : null}

          {school.phone ? (
            <div className="bg-white rounded-2xl border border-grey-300 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-5 h-5 text-magenta" />
                <div>
                  <p className="font-semibold text-navy">Phone</p>
                  <a href={`tel:${school.phone}`} className="text-grey-700 text-sm">
                    {school.phone}
                  </a>
                </div>
              </div>
              <a
                href={`tel:${school.phone}`}
                className="text-magenta font-semibold text-sm inline-flex items-center gap-2"
              >
                Call Now ↗
              </a>
            </div>
          ) : null}

          {school.email ? (
            <div className="bg-white rounded-2xl border border-grey-300 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-5 h-5 text-magenta" />
                <div>
                  <p className="font-semibold text-navy">Email</p>
                  <a href={`mailto:${school.email}`} className="text-grey-700 text-sm">
                    {school.email}
                  </a>
                </div>
              </div>
              <a
                href={`mailto:${school.email}`}
                className="text-magenta font-semibold text-sm inline-flex items-center gap-2"
              >
                Send Email ↗
              </a>
            </div>
          ) : null}

          {school.website_url ? (
            <div className="bg-white rounded-2xl border border-grey-300 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Globe className="w-5 h-5 text-magenta" />
                <div>
                  <p className="font-semibold text-navy">Website</p>
                  <p className="text-grey-700 text-sm">
                    {school.website_url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
              <a
                href={school.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-magenta font-semibold text-sm inline-flex items-center gap-2"
              >
                Visit Website ↗
              </a>
            </div>
          ) : null}
        </div>

        {(school.fee_page_url ||
          school.enrolment_url ||
          school.tours_url ||
          school.latest_reports_url) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {school.fee_page_url ? (
              <a
                href={school.fee_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-grey-300 rounded-xl text-sm font-semibold text-grey-700 hover:bg-grey-100 hover:border-grey-300 transition-all"
              >
                💰 View Fees
              </a>
            ) : null}
            {school.enrolment_url ? (
              <a
                href={school.enrolment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-grey-300 rounded-xl text-sm font-semibold text-grey-700 hover:bg-grey-100 hover:border-grey-300 transition-all"
              >
                📋 Enrolment Info
              </a>
            ) : null}
            {school.tours_url ? (
              <a
                href={school.tours_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-grey-300 rounded-xl text-sm font-semibold text-grey-700 hover:bg-grey-100 hover:border-grey-300 transition-all"
              >
                🏫 Book a Tour
              </a>
            ) : null}
            {school.latest_reports_url ? (
              <a
                href={school.latest_reports_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-grey-300 rounded-xl text-sm font-semibold text-grey-700 hover:bg-grey-100 hover:border-grey-300 transition-all"
              >
                📄 Annual Report
              </a>
            ) : null}
          </div>
        )}

        {(school.facebook_url || school.instagram_url) && (
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-grey-500">Follow {school.school_name}:</span>
            {school.facebook_url ? (
              <a href={school.facebook_url} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-grey-500 hover:text-blue-600" />
              </a>
            ) : null}
            {school.instagram_url ? (
              <a href={school.instagram_url} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-grey-500 hover:text-pink-500" />
              </a>
            ) : null}
          </div>
        )}
      </section>

      {school.extra_campuses ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">📍 Campus Locations</h3>
            <p className="text-grey-700 text-sm leading-relaxed">{school.extra_campuses}</p>
          </div>
        </section>
      ) : null}

      {school.latitude && school.longitude ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="rounded-2xl overflow-hidden h-64 lg:h-80">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3000!2d${school.longitude}!3d${school.latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sau`}
              className="w-full h-full border-0"
              loading="lazy"
              title={`Map showing ${school.school_name} location`}
            />
          </div>
        </section>
      ) : null}

      {nearbySchools.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {(() => {
            const withinFive = nearbySchools.filter((item) => item.distance_km <= 5);
            const display = withinFive.length ? withinFive : nearbySchools;
            return (
              <>
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">Nearby Schools</h2>
                    <p className="text-grey-500 text-sm">
                      {withinFive.length
                        ? `Schools within 5km of ${school.school_name}`
                        : `Schools near ${school.school_name}`}
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {display.map((nearby) => (
                    <Link
                      key={nearby.school_id}
                      href={`/school/${nearby.slug}`}
                      className="bg-white rounded-xl border border-grey-300 p-5 hover:shadow-md transition-all"
                    >
                      <h3 className="font-bold text-navy mb-1">{nearby.school_name}</h3>
                      <p className="text-sm text-grey-500 mb-2">
                        {nearby.suburb} · {nearby.gender} · {nearby.year_levels_text}
                      </p>
                      <p className="text-xs text-grey-500">
                        {nearby.sector} · {nearby.distance_km.toFixed(1)}km
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            );
          })()}
        </section>
      ) : null}

      {similarSchools.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">Schools Like This</h2>
              <p className="text-grey-500 text-sm">
                Similar {school.sector.toLowerCase()} {school.gender.toLowerCase()} schools
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarSchools.map((similar) => (
              <Link
                key={similar.school_id}
                href={`/school/${similar.slug}`}
                className="bg-white rounded-xl border border-grey-300 p-5 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-navy mb-1">{similar.school_name}</h3>
                <p className="text-sm text-grey-500">
                  {similar.suburb} · {similar.gender} · {similar.year_levels_text}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link href="/school-directory" className="text-magenta font-semibold">
              Compare these schools →
            </Link>
          </div>
        </section>
      ) : null}

      {!isGovernment ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-navy to-[#3a4f65] rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Investing in their education?
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              SchoolSure protects your school fees if something happens to you. Your child
              stays at {school.school_name}. Get covered for less than the cost of a coffee a day.
            </p>
            <Link
              href={quoteUrl}
              className="inline-flex items-center gap-2 px-8 py-4 bg-magenta hover:bg-magenta-dark text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-magenta/30"
            >
              Get a Quote for {school.school_name} →
            </Link>
            <p className="text-sm text-white/30 mt-4">
              60 seconds · No paperwork · Cancel anytime
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
