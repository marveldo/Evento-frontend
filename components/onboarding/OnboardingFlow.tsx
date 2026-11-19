"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/common/LoadingButton";
import { RolePicker } from "@/components/auth/RolePicker";
import { InterestPicker } from "@/components/interests/InterestPicker";
import { useSession } from "@/components/providers/SessionProvider";
import { api } from "@/lib/api/client";
import { homeFor } from "@/lib/navigation";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { Category, UserRole } from "@/lib/types";

type Step = "role" | "interests";

interface OnboardingFlowProps {
  name: string;
  initialRole: UserRole;
  categories: Category[];
}

export function OnboardingFlow({ name, initialRole, categories }: OnboardingFlowProps) {
  const router = useRouter();
  const { updateUser } = useSession();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const finish = async (chosen: string[]) => {
    setSaving(true);
    try {
      const user = await api.completeOnboarding(role, chosen);
      updateUser({ role: user.role, onboarded: user.onboarded });
      notifySuccess("You're all set", role === "organizer" ? "Create your first event whenever you're ready." : "Here are events picked for you.");
      router.replace(homeFor(user.role));
      router.refresh();
    } catch (error) {
      setSaving(false);
      notifyApiError(error, "Couldn't save your answers");
    }
  };

  const steps = role === "attendee" ? 2 : 1;
  const stepNumber = step === "role" ? 1 : 2;

  return (
    <div className="w-full max-w-[560px] space-y-8 rounded-[16px] p-6 font-nunito shadow-lg shadow-[#0000000A] sm:p-12">
      <div className="space-y-2 text-center">
        <p className="text-[12px] font-[700] uppercase tracking-[0.08em] text-brand">
          Step {stepNumber} of {steps}
        </p>
        <h1 className="font-montserrat text-[26px] font-[600] sm:text-[32px]">
          {step === "role" ? `Welcome${name ? `, ${name.split(" ")[0]}` : ""}!` : "What are you into?"}
        </h1>
        <p className="text-[14px] text-[#6B6B6B]">
          {step === "role"
            ? "Tell us how you'll use Evento so we can set things up for you."
            : "Pick the kinds of events you like. We'll recommend events that match."}
        </p>
      </div>

      {step === "role" ? (
        <RolePicker value={role} onChange={setRole} disabled={saving} />
      ) : (
        <InterestPicker categories={categories} value={interests} onChange={setInterests} disabled={saving} />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step === "interests" ? (
          <Button type="button" variant="ghost" disabled={saving} onClick={() => setStep("role")}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {step === "interests" && (
            <Button type="button" variant="brandOutline" disabled={saving} onClick={() => finish([])}>
              Skip for now
            </Button>
          )}
          {step === "role" && role === "attendee" ? (
            <Button type="button" variant="brand" onClick={() => setStep("interests")}>
              Continue
            </Button>
          ) : (
            <LoadingButton
              type="button"
              variant="brand"
              loading={saving}
              disabled={step === "interests" && interests.length === 0}
              onClick={() => finish(step === "interests" ? interests : [])}
            >
              {role === "organizer" ? "Start organizing" : `Show my events${interests.length ? ` (${interests.length})` : ""}`}
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
}
