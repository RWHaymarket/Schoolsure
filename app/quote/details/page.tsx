"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";

const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Other"];
const yearOptions = [
  "Prep / Kindy",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
];

const getAge = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

const isAgeBetween = (value: string, min: number, max: number) => {
  const age = getAge(value);
  if (age === null) return false;
  return age >= min && age <= max;
};

const isAustralianMobile = (value: string) => {
  const digits = value.replace(/\s/g, "");
  return /^04\d{8}$/.test(digits);
};

const formSchema = z.object({
  parentTitle: z.string().optional(),
  parentFirstName: z.string().min(1, "First name is required"),
  parentLastName: z.string().min(1, "Last name is required"),
  parentEmail: z.string().email("Please enter a valid email"),
  parentPhone: z
    .string()
    .min(1, "Mobile number is required")
    .refine(isAustralianMobile, "Please enter a valid Australian mobile number"),
  parentDob: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (value) => isAgeBetween(value, 18, 59),
      "Cover is available for fee payers aged 18 to 59."
    ),
  parentPostcode: z
    .string()
    .regex(/^\d{4}$/, "Please enter a valid postcode"),
  children: z
    .array(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        dateOfBirth: z
          .string()
          .min(1, "Date of birth is required")
          .refine(
            (value) => isAgeBetween(value, 4, 19),
            "Children must be aged 4 to 19."
          ),
        gender: z.string().optional(),
        yearLevel: z.string().min(1, "Year level is required"),
      })
    )
    .min(1, "At least one child is required"),
});

type FormValues = z.infer<typeof formSchema>;

const selectClassName =
  "h-[52px] w-full rounded-[10px] border-2 border-transparent bg-grey-100 px-4 text-base text-navy transition-all duration-150 ease-out focus:border-magenta focus:bg-white focus:outline-none focus:ring-4 focus:ring-magenta/20";

const getFirstErrorName = (errors: Record<string, any>, prefix = ""): string | null => {
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    if (value?.message) {
      return `${prefix}${key}`;
    }
    if (value && typeof value === "object") {
      const nested = getFirstErrorName(value, `${prefix}${key}.`);
      if (nested) return nested;
    }
  }
  return null;
};

export default function QuoteDetailsStep() {
  const router = useRouter();
  const store = useQuoteStore();
  const {
    schoolName,
    annualFees,
    fullTermUpgrade,
    includeStudentCover,
    includeExpensesCover,
    premiumBreakdown,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhone,
    parentDob,
    children,
    setParentDetails,
  } = store;

  const parentTitle = (store as any).parentTitle ?? "";
  const parentPostcode = (store as any).parentPostcode ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      parentTitle,
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentDob,
      parentPostcode,
      children: children.length
        ? children.map((child: any) => ({
            firstName: child.firstName || "",
            lastName: child.lastName || "",
            dateOfBirth: child.dateOfBirth || "",
            gender: child.gender || "",
            yearLevel: child.yearLevel || "",
          }))
        : [
            {
              firstName: "",
              lastName: "",
              dateOfBirth: "",
              gender: "",
              yearLevel: "",
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!values) return;
      const nextChildren = (values.children || []).map((child) => ({
        ...child,
        schoolName,
        annualFee: annualFees,
      }));

      setParentDetails({
        parentFirstName: values.parentFirstName || "",
        parentLastName: values.parentLastName || "",
        parentEmail: values.parentEmail || "",
        parentPhone: values.parentPhone || "",
        parentDob: values.parentDob || "",
        parentTitle: values.parentTitle || "",
        parentPostcode: values.parentPostcode || "",
        children: nextChildren as any,
      } as any);
    });

    return () => subscription.unsubscribe();
  }, [annualFees, form, schoolName, setParentDetails]);

  const coverageLines = useMemo(
    () => [
      "Parent Continuity Cover",
      ...(fullTermUpgrade ? ["Full Term Upgrade"] : []),
      ...(includeStudentCover ? ["Student Continuity Cover"] : []),
      ...(includeExpensesCover ? ["School Expenses Cover"] : []),
    ],
    [fullTermUpgrade, includeExpensesCover, includeStudentCover]
  );

  const productTotals = useMemo(() => {
    const totals = premiumBreakdown.children?.reduce(
      (acc, child) => {
        acc.productA += child.productA || 0;
        acc.fullTerm += child.fullTermUpgradeAmount || 0;
        acc.productB += child.productB || 0;
        acc.productC += child.productC || 0;
        return acc;
      },
      { productA: 0, fullTerm: 0, productB: 0, productC: 0 }
    );
    return totals || { productA: 0, fullTerm: 0, productB: 0, productC: 0 };
  }, [premiumBreakdown.children]);

  const onSubmit = () => {
    router.push("/quote/review");
  };

  const onInvalid = (errors: Record<string, any>) => {
    const firstError = getFirstErrorName(errors);
    if (!firstError) return;
    const selector = `[name="${firstError}"]`;
    const element = document.querySelector(selector) as HTMLElement | null;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  const onContinue = form.handleSubmit(onSubmit, onInvalid);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 pb-28 lg:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
              Step 3 of 4
            </p>
            <h1 className="text-[36px] font-black text-navy tracking-tight">
              Your details
            </h1>
            <p className="mt-2 text-base text-grey-700">
              Tell us about you and your children. This takes about 2 minutes.
            </p>
          </div>
          <div className="text-sm text-grey-500">Saved as you go</div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            <Card className="rounded-2xl border border-grey-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="text-[20px] font-semibold text-navy">
                Parent or guardian
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Title
                  </label>
                  <select
                    className={selectClassName}
                    {...form.register("parentTitle")}
                  >
                    <option value="">Select title</option>
                    {titleOptions.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    First name <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      {...form.register("parentFirstName")}
                      error={!!form.formState.errors.parentFirstName}
                      success={
                        !!form.formState.touchedFields.parentFirstName &&
                        !form.formState.errors.parentFirstName &&
                        !!form.getValues("parentFirstName")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentFirstName &&
                    !form.formState.errors.parentFirstName &&
                    form.getValues("parentFirstName") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentFirstName ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentFirstName.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Last name <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      {...form.register("parentLastName")}
                      error={!!form.formState.errors.parentLastName}
                      success={
                        !!form.formState.touchedFields.parentLastName &&
                        !form.formState.errors.parentLastName &&
                        !!form.getValues("parentLastName")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentLastName &&
                    !form.formState.errors.parentLastName &&
                    form.getValues("parentLastName") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentLastName ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentLastName.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Email address <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      {...form.register("parentEmail")}
                      error={!!form.formState.errors.parentEmail}
                      success={
                        !!form.formState.touchedFields.parentEmail &&
                        !form.formState.errors.parentEmail &&
                        !!form.getValues("parentEmail")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentEmail &&
                    !form.formState.errors.parentEmail &&
                    form.getValues("parentEmail") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentEmail ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentEmail.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Mobile number <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      inputMode="tel"
                      maxLength={12}
                      placeholder="0412 345 678"
                      {...form.register("parentPhone", {
                        onChange: (event) =>
                          form.setValue(
                            "parentPhone",
                            formatPhone(event.target.value),
                            { shouldValidate: true }
                          ),
                      })}
                      error={!!form.formState.errors.parentPhone}
                      success={
                        !!form.formState.touchedFields.parentPhone &&
                        !form.formState.errors.parentPhone &&
                        !!form.getValues("parentPhone")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentPhone &&
                    !form.formState.errors.parentPhone &&
                    form.getValues("parentPhone") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentPhone ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentPhone.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Date of birth <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      {...form.register("parentDob")}
                      error={!!form.formState.errors.parentDob}
                      success={
                        !!form.formState.touchedFields.parentDob &&
                        !form.formState.errors.parentDob &&
                        !!form.getValues("parentDob")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentDob &&
                    !form.formState.errors.parentDob &&
                    form.getValues("parentDob") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentDob ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentDob.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                    Residential postcode <span className="text-grey-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      maxLength={4}
                      {...form.register("parentPostcode")}
                      error={!!form.formState.errors.parentPostcode}
                      success={
                        !!form.formState.touchedFields.parentPostcode &&
                        !form.formState.errors.parentPostcode &&
                        !!form.getValues("parentPostcode")
                      }
                      className="focus:border-magenta focus:ring-magenta/20 pr-10"
                    />
                    {!!form.formState.touchedFields.parentPostcode &&
                    !form.formState.errors.parentPostcode &&
                    form.getValues("parentPostcode") ? (
                      <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
                    ) : null}
                  </div>
                  {form.formState.errors.parentPostcode ? (
                    <p className="mt-1 text-[14px] text-error">
                      {form.formState.errors.parentPostcode.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-grey-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[20px] font-semibold text-navy">
                    Your children
                  </div>
                  <p className="text-[14px] text-grey-700">
                    Add each child you&apos;d like covered.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {fields.map((field, index) => {
                  const childErrors = form.formState.errors.children?.[index];
                  return (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-grey-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-base font-semibold text-navy">
                          Child {index + 1}
                        </div>
                        <div className="text-[14px] font-semibold text-magenta">
                          {formatCurrency(annualFees || 0)}/year
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            First name <span className="text-grey-500">*</span>
                          </label>
                          <Input
                            {...form.register(`children.${index}.firstName`)}
                            error={!!childErrors?.firstName}
                            success={
                              !!form.formState.touchedFields.children?.[index]
                                ?.firstName &&
                              !childErrors?.firstName &&
                              !!form.getValues(`children.${index}.firstName`)
                            }
                            className="focus:border-magenta focus:ring-magenta/20"
                          />
                          {childErrors?.firstName ? (
                            <p className="mt-1 text-[14px] text-error">
                              {childErrors.firstName.message}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            Last name <span className="text-grey-500">*</span>
                          </label>
                          <Input
                            {...form.register(`children.${index}.lastName`)}
                            error={!!childErrors?.lastName}
                            success={
                              !!form.formState.touchedFields.children?.[index]
                                ?.lastName &&
                              !childErrors?.lastName &&
                              !!form.getValues(`children.${index}.lastName`)
                            }
                            className="focus:border-magenta focus:ring-magenta/20"
                          />
                          {childErrors?.lastName ? (
                            <p className="mt-1 text-[14px] text-error">
                              {childErrors.lastName.message}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            Date of birth <span className="text-grey-500">*</span>
                          </label>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...form.register(`children.${index}.dateOfBirth`)}
                            error={!!childErrors?.dateOfBirth}
                            success={
                              !!form.formState.touchedFields.children?.[index]
                                ?.dateOfBirth &&
                              !childErrors?.dateOfBirth &&
                              !!form.getValues(`children.${index}.dateOfBirth`)
                            }
                            className="focus:border-magenta focus:ring-magenta/20"
                          />
                          {childErrors?.dateOfBirth ? (
                            <p className="mt-1 text-[14px] text-error">
                              {childErrors.dateOfBirth.message}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            Gender
                          </label>
                          <select
                            className={selectClassName}
                            {...form.register(`children.${index}.gender`)}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Prefer not to say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            School name
                          </label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Input
                              value={schoolName || "Selected school"}
                              readOnly
                              className="bg-grey-100 text-grey-700"
                            />
                            <button
                              type="button"
                              className="text-sm font-semibold text-magenta"
                              onClick={() => router.push("/quote/school")}
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            Year level <span className="text-grey-500">*</span>
                          </label>
                          <select
                            className={selectClassName}
                            {...form.register(`children.${index}.yearLevel`)}
                          >
                            <option value="">Select year level</option>
                            {yearOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {childErrors?.yearLevel ? (
                            <p className="mt-1 text-[14px] text-error">
                              {childErrors.yearLevel.message}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                            Annual school fee
                          </label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Input
                              value={formatCurrency(annualFees || 0)}
                              readOnly
                              className="bg-grey-100 text-grey-700"
                            />
                            <button
                              type="button"
                              className="text-sm font-semibold text-magenta"
                              onClick={() => router.push("/quote/school")}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>

                      {fields.length > 1 ? (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          {confirmRemoveIndex === index ? (
                            <div className="flex flex-wrap items-center gap-3 text-sm text-grey-700">
                              <span>
                                Remove{" "}
                                {form.getValues(`children.${index}.firstName`) ||
                                  "child"}
                                ? This can&apos;t be undone.
                              </span>
                              <button
                                type="button"
                                className="text-sm font-semibold text-magenta"
                                onClick={() => {
                                  remove(index);
                                  setConfirmRemoveIndex(null);
                                }}
                              >
                                Remove
                              </button>
                              <button
                                type="button"
                                className="text-sm font-semibold text-grey-500"
                                onClick={() => setConfirmRemoveIndex(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-sm text-grey-500"
                              onClick={() => setConfirmRemoveIndex(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove child
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-navy px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-grey-50"
                onClick={() =>
                  append({
                    firstName: "",
                    lastName: "",
                    dateOfBirth: "",
                    gender: "",
                    yearLevel: "",
                  })
                }
              >
                <Plus className="h-5 w-5" />
                Add another child — save 10%
              </button>
            </Card>

            <Card className="rounded-xl bg-grey-100 p-5">
              <div className="text-[14px] font-semibold text-navy">
                Your selected cover:
              </div>
              <ul className="mt-3 space-y-2 text-sm text-grey-700">
                {coverageLines.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-magenta/10">
                      <Check className="h-3.5 w-3.5 text-magenta" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-magenta"
                onClick={() => router.push("/quote/coverage")}
              >
                Change cover →
              </button>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/quote/coverage")}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-4 text-xs text-grey-500">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-magenta" />
                  Underwritten by Lloyd&apos;s
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-magenta" />
                  Secure and encrypted
                </span>
              </div>
              <Button type="submit">
                Continue to Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="hidden lg:block lg:sticky lg:top-24 h-fit space-y-4">
            <Card className="rounded-2xl border border-grey-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="text-sm font-semibold text-navy">Price summary</div>
              <div className="mt-4 space-y-2 text-sm text-grey-600">
                <div className="flex items-center justify-between">
                  <span>Annual total</span>
                  <span className="font-semibold text-navy">
                    {formatCurrency(premiumBreakdown.annualTotal || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly equivalent</span>
                  <span className="font-semibold text-navy">
                    {formatCurrency(premiumBreakdown.monthlyTotal || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Per day</span>
                  <span className="font-semibold text-navy">
                    From {formatCurrency(premiumBreakdown.dailyEquivalent || 0)}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-grey-50 p-4 text-sm text-grey-600">
                <div className="font-semibold text-navy mb-2">
                  Included cover
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Parent Continuity Cover</span>
                    <span className="font-semibold text-navy">
                      {formatCurrency(productTotals.productA)}
                    </span>
                  </div>
                  {fullTermUpgrade ? (
                    <div className="flex items-center justify-between">
                      <span>Full Term Upgrade</span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(productTotals.fullTerm)}
                      </span>
                    </div>
                  ) : null}
                  {includeStudentCover ? (
                    <div className="flex items-center justify-between">
                      <span>Student Continuity Cover</span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(productTotals.productB)}
                      </span>
                    </div>
                  ) : null}
                  {includeExpensesCover ? (
                    <div className="flex items-center justify-between">
                      <span>School Expenses Cover</span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(productTotals.productC)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <Button className="mt-6 w-full" onClick={onContinue}>
                Continue to Review
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="mt-4 space-y-2 text-[13px] text-grey-500">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-magenta" />
                  Underwritten by Lloyd&apos;s of London
                </div>
                <div className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-magenta" />
                  No medical screening required
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-grey-200 bg-white px-6 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[18px] font-black text-navy">
              {formatCurrency(premiumBreakdown.annualTotal || 0)}/yr
            </div>
            <div className="text-[14px] text-grey-500">
              {formatCurrency(premiumBreakdown.monthlyTotal || 0)}/mo
            </div>
          </div>
          <Button className="min-w-[140px]" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}
