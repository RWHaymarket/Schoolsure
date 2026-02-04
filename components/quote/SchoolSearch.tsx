"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Check, Search, School as SchoolIcon } from "lucide-react";

import { schools, type School } from "@/data/schools";
import { cn } from "@/lib/utils";

interface SchoolSearchProps {
  value: School | null;
  onSelect: (school: School) => void;
  onFeesChange: (fees: number) => void;
  onQueryChange: (value: string) => void;
  initialSchoolName?: string | null;
  initialSchoolId?: string | null;
}

export default function SchoolSearch({
  value,
  onSelect,
  onFeesChange,
  onQueryChange,
  initialSchoolName,
  initialSchoolId,
}: SchoolSearchProps) {
  const [query, setQuery] = useState(value?.name || "");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<School[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialSchoolName && !initialSchoolId) return;
    if (initialSchoolName) {
      setQuery(initialSchoolName);
      onQueryChange(initialSchoolName);
    }
    const matchingSchool = schools.find(
      (school) =>
        (initialSchoolId && school.id === initialSchoolId) ||
        (initialSchoolName && school.name === initialSchoolName)
    );
    if (matchingSchool) {
      onSelect(matchingSchool);
      if (matchingSchool.fees) {
        onFeesChange(matchingSchool.fees);
      }
    }
    setIsOpen(false);
  }, [initialSchoolName, initialSchoolId, onFeesChange, onQueryChange, onSelect]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = schools
      .filter(
        (school) =>
          school.name.toLowerCase().includes(lowerQuery) ||
          school.suburb.toLowerCase().includes(lowerQuery) ||
          school.postcode.includes(query)
      )
      .slice(0, 8);

    setResults(filtered);
  }, [query]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (school: School) => {
    setQuery(school.name);
    onSelect(school);
    if (school.fees) {
      onFeesChange(school.fees);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-off-white">
          <Search className="h-6 w-6 text-navy" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            onQueryChange(nextValue);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Start typing school name..."
          className={cn(
            "w-full rounded-xl border-2 border-transparent bg-grey-100 py-4 pl-14 pr-4 text-lg",
            "focus:bg-white focus:border-navy focus:outline-none",
            "transition-all duration-200"
          )}
        />
        {value ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Check className="h-5 w-5 text-green-500" />
          </div>
        ) : null}
      </div>

      {value ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
            <Building2 className="h-5 w-5 text-navy" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy">{value.name}</p>
            <p className="text-sm text-grey-500">
              {value.suburb}, {value.state} · {value.sector}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              value.sector === "Independent"
                ? "bg-navy/10 text-navy"
                : "bg-magenta/10 text-magenta"
            )}
          >
            {value.sector}
          </span>
        </div>
      ) : null}

      {isOpen && results.length > 0 ? (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-xl"
        >
          {results.map((school) => (
            <button
              key={school.id}
              type="button"
              onClick={() => handleSelect(school)}
              className={cn(
                "flex w-full items-center gap-4 px-4 py-3 text-left transition-colors",
                "hover:bg-grey-50",
                value?.id === school.id && "bg-green-50"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-grey-100">
                <Building2 className="h-5 w-5 text-grey-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-navy">{school.name}</p>
                <p className="text-sm text-grey-500">
                  {school.suburb}, {school.postcode}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  school.sector === "Independent"
                    ? "bg-navy/10 text-navy"
                    : "bg-magenta/10 text-magenta"
                )}
              >
                {school.sector}
              </span>
              {value?.id === school.id ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {isOpen && query.length >= 2 && results.length === 0 ? (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-grey-200 bg-white p-6 text-center shadow-xl">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-off-white">
            <SchoolIcon className="h-6 w-6 text-grey-500" />
          </div>
          <p className="text-grey-500">No schools found matching "{query}"</p>
          <p className="mt-1 text-sm text-grey-400">
            Try a different name or enter details manually
          </p>
        </div>
      ) : null}

      <p className="mt-2 text-sm text-grey-500">
        We have 780+ Australian Independent and Catholic schools in our database
      </p>
    </div>
  );
}
