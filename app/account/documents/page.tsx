"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, Mail } from "lucide-react";

import Toast from "@/components/shared/Toast";
import { mockAccount } from "@/lib/mock-account-data";
import { formatDateLong } from "@/lib/account-utils";

export default function AccountDocumentsPage() {
  const [toast, setToast] = useState(false);

  const handleDownload = () => {
    setToast(true);
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <Toast
          title="Download coming soon"
          message="Document download will be available when your policy is live."
          variant="info"
          onClose={() => setToast(false)}
          className="absolute right-6 top-6"
        />
      ) : null}

      <div>
        <h1 className="text-[28px] font-black text-navy">Documents</h1>
        <p className="mt-1 text-[16px] text-grey-500">
          Download your policy documents
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="space-y-4">
          {mockAccount.documents.map((doc) => (
            <div
              key={doc.name}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-grey-200 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-navy" />
                <div>
                  <div className="text-[16px] font-semibold text-navy">
                    {doc.name}
                  </div>
                  <div className="text-[14px] text-grey-500">
                    {doc.name === "Policy Schedule" &&
                      "Your personalised policy details and cover summary"}
                    {doc.name === "Product Disclosure Statement" &&
                      "Full terms, conditions, and exclusions"}
                    {doc.name === "Financial Services Guide" &&
                      "Information about Niche Insurance and our services"}
                    {doc.name === "Certificate of Insurance" &&
                      "Proof of your cover"}
                    {doc.name === "Premium Summary" &&
                      "Breakdown of your premium by child and product"}
                  </div>
                  <div className="mt-1 text-[13px] text-grey-500">
                    {doc.type.toUpperCase()} · {doc.size} · {formatDateLong(doc.date)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-magenta"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-off-white p-4">
        <div className="flex items-center gap-3 text-[14px] text-grey-700">
          <Mail className="h-5 w-5 text-navy" />
          Need a document we haven&apos;t listed?
          <Link href="/contact" className="font-semibold text-magenta">
            Contact us →
          </Link>
        </div>
      </div>
    </div>
  );
}
