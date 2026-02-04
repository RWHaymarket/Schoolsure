"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/shared/Toast";
import { mockAccount } from "@/lib/mock-account-data";
import { formatDateLong } from "@/lib/account-utils";

const toggleClass =
  "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out";

export default function AccountSettingsPage() {
  const { parent } = mockAccount;
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState({
    renewal: true,
    updates: true,
    education: false,
  });

  const handleSave = () => {
    setEditMode(false);
    setToast(true);
  };

  const handlePasswordUpdate = () => {
    setToast(true);
    setShowPassword(false);
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <Toast
          title="Details updated"
          message="Your settings have been saved."
          variant="success"
          onClose={() => setToast(false)}
          className="absolute right-6 top-6"
        />
      ) : null}

      <div>
        <h1 className="text-[28px] font-black text-navy">Account settings</h1>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-navy">
            Personal details
          </h2>
          {!editMode ? (
            <button
              className="text-[14px] font-semibold text-magenta"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          ) : null}
        </div>

        {!editMode ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 text-[14px]">
            <div>
              <div className="text-grey-500">Name</div>
              <div className="text-navy font-semibold">
                {parent.firstName} {parent.lastName}
              </div>
            </div>
            <div>
              <div className="text-grey-500">Email</div>
              <div className="text-navy font-semibold">{parent.email}</div>
            </div>
            <div>
              <div className="text-grey-500">Mobile</div>
              <div className="text-navy font-semibold">{parent.mobile}</div>
            </div>
            <div>
              <div className="text-grey-500">Date of birth</div>
              <div className="text-navy font-semibold">
                {formatDateLong(parent.dateOfBirth)}
              </div>
            </div>
            <div>
              <div className="text-grey-500">Postcode</div>
              <div className="text-navy font-semibold">{parent.postcode}</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input defaultValue={parent.firstName} />
            <Input defaultValue={parent.lastName} />
            <Input defaultValue={parent.email} type="email" />
            <Input defaultValue={parent.mobile} />
            <Input defaultValue={parent.dateOfBirth} type="date" />
            <Input defaultValue={parent.postcode} />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>Save changes</Button>
              <button
                className="text-[14px] text-grey-500"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">
          Password & security
        </h2>
        {!showPassword ? (
          <Button variant="secondary" onClick={() => setShowPassword(true)}>
            Change password
          </Button>
        ) : (
          <div className="mt-4 grid gap-4">
            <Input type="password" placeholder="Current password" />
            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm new password" />
            <div className="flex items-center gap-3">
              <Button onClick={handlePasswordUpdate}>Update password</Button>
              <button
                className="text-[14px] text-grey-500"
                onClick={() => setShowPassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">
          Communication preferences
        </h2>
        <div className="mt-4 space-y-4 text-[14px] text-grey-700">
          {[
            {
              key: "renewal",
              label: "Renewal reminders",
              description: "We'll remind you before your policy renews",
            },
            {
              key: "updates",
              label: "Product updates",
              description: "New features and cover enhancements",
            },
            {
              key: "education",
              label: "Educational content",
              description: "Tips on managing school costs",
            },
          ].map((item) => {
            const enabled = preferences[item.key as keyof typeof preferences];
            return (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy">{item.label}</div>
                  <div className="text-[14px] text-grey-500">
                    {item.description}
                  </div>
                </div>
                <button
                  type="button"
                  className={`${toggleClass} ${
                    enabled ? "bg-magenta" : "bg-grey-300"
                  }`}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [item.key]: !enabled,
                    }))
                  }
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-all duration-200 ${
                      enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-grey-300 bg-white p-7 shadow-sm">
        <div className="text-[16px] font-semibold text-error">Cancel policy</div>
        <div className="mt-2 text-[14px] text-grey-500">
          If you cancel your policy, your cover will end at the next payment date.
        </div>
        <a href="/contact" className="mt-2 inline-flex text-[14px] text-grey-500">
          Contact us to discuss cancellation →
        </a>
      </div>
    </div>
  );
}
