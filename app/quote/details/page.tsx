"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import InfoBox from "@/components/shared/InfoBox";
import { childSchema, parentDetailsSchema } from "@/lib/validation";
import { formatPhone } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";

const formSchema = parentDetailsSchema.extend({
  children: z.array(childSchema).min(1, "At least one child is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuoteDetailsStep() {
  const router = useRouter();
  const {
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhone,
    parentDob,
    children,
    setParentDetails,
  } = useQuoteStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentDob,
      children: children.length
        ? children
        : [{ firstName: "", dateOfBirth: "", yearLevel: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const onSubmit = (values: FormValues) => {
    setParentDetails({
      parentFirstName: values.parentFirstName,
      parentLastName: values.parentLastName,
      parentEmail: values.parentEmail,
      parentPhone: values.parentPhone,
      parentDob: values.parentDob,
      children: values.children,
    });

    router.push("/quote/review");
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
              Step 3 of 4
            </p>
            <h1 className="text-h1 text-navy tracking-tight">Your details</h1>
            <p className="mt-3 text-lg text-grey-700">
              We need a few details to personalise your quote.
            </p>
          </div>
          <div className="text-sm text-grey-500">
            Saved as you go
          </div>
        </div>

        <Card className="mt-8 border border-grey-100 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="text-xs font-semibold uppercase text-grey-500">
                About you (primary fee payer)
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-small font-medium text-navy">
                    First name
                  </label>
                  <Input {...form.register("parentFirstName")} />
                </div>
                <div>
                  <label className="mb-2 block text-small font-medium text-navy">
                    Last name
                  </label>
                  <Input {...form.register("parentLastName")} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-small font-medium text-navy">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-off-white">
                        <Mail className="h-5 w-5 text-navy" />
                      </span>
                    </span>
                    <Input className="pl-14" type="email" {...form.register("parentEmail")} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-small font-medium text-navy">
                    Phone number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-off-white">
                        <Phone className="h-5 w-5 text-navy" />
                      </span>
                    </span>
                    <Input
                      className="pl-14"
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
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-small font-medium text-navy">
                    Date of birth
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-off-white">
                        <Calendar className="h-5 w-5 text-navy" />
                      </span>
                    </span>
                    <Input
                      className="pl-14"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      {...form.register("parentDob")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase text-grey-500">
                About your child
              </div>
              <InfoBox variant="info" className="mt-3">
                We&apos;ll use this to personalise your policy documents.
              </InfoBox>

              <div className="mt-4 space-y-8">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-4 rounded-2xl border border-grey-100 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)] md:grid-cols-3"
                  >
                    <div>
                      <label className="mb-2 block text-small font-medium text-navy">
                        Child&apos;s first name
                      </label>
                      <Input {...form.register(`children.${index}.firstName`)} />
                    </div>
                    <div>
                      <label className="mb-2 block text-small font-medium text-navy">
                        Date of birth
                      </label>
                      <Input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...form.register(`children.${index}.dateOfBirth`)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-small font-medium text-navy">
                        Year level
                      </label>
                      <select
                        className="h-[52px] w-full rounded-[10px] border-2 border-transparent bg-grey-100 px-4 text-base text-navy transition-all duration-150 ease-out focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10"
                        {...form.register(`children.${index}.yearLevel`)}
                      >
                        <option value="">Select year level</option>
                        <option>Kindergarten</option>
                        <option>Year 1</option>
                        <option>Year 2</option>
                        <option>Year 3</option>
                        <option>Year 4</option>
                        <option>Year 5</option>
                        <option>Year 6</option>
                        <option>Year 7</option>
                        <option>Year 8</option>
                        <option>Year 9</option>
                        <option>Year 10</option>
                        <option>Year 11</option>
                        <option>Year 12</option>
                      </select>
                    </div>
                    {fields.length > 1 ? (
                      <div className="md:col-span-3">
                        <button
                          type="button"
                          className="text-sm font-semibold text-magenta"
                          onClick={() => remove(index)}
                        >
                          Remove child
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 text-sm font-semibold text-magenta"
                onClick={() =>
                  append({ firstName: "", dateOfBirth: "", yearLevel: "" })
                }
              >
                + Add another child (15% off each additional child)
              </button>
            </div>

            <InfoBox variant="info">
              Your information is secure and will only be used to process your
              quote and policy.
            </InfoBox>

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
                  AFSL 530784
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
        </Card>
      </div>
    </section>
  );
}
