"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { CalendarPlus, Ticket } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/common/LoadingButton";
import { InterestPicker } from "@/components/interests/InterestPicker";
import { SettingsSection } from "@/components/settings/SettingsCard";
import { useSession } from "@/components/providers/SessionProvider";
import { api } from "@/lib/api/client";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { Category, User } from "@/lib/types";

interface PreferencesFormProps {
  user: User;
  categories: Category[];
  upgradePrompt: boolean;
}

function RoleCard({ user, upgradePrompt }: { user: User; upgradePrompt: boolean }) {
  const router = useRouter();
  const { updateUser } = useSession();
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const organizer = user.role === "organizer";

  const upgrade = async () => {
    setSaving(true);
    try {
      const updated = await api.becomeOrganizer();
      updateUser({ role: updated.role, onboarded: updated.onboarded });
      notifySuccess("You're now an organizer", "You can create and manage events.");
      setConfirming(false);
      router.push("/create-event");
      router.refresh();
    } catch (error) {
      notifyApiError(error, "Couldn't update your account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {upgradePrompt && !organizer && (
        <p className="rounded-[8px] bg-brand-light px-4 py-3 font-nunito text-[14px] text-brand-text">
          Creating and managing events needs an organizer account.
        </p>
      )}
      <div className="flex flex-col gap-4 rounded-[12px] border border-[#EBEBEB] p-5 font-nunito sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-x-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            {organizer ? <CalendarPlus className="size-5" /> : <Ticket className="size-5" />}
          </span>
          <div>
            <p className="text-[16px] font-[700]">{organizer ? "Event organizer" : "Attendee"}</p>
            <p className="text-[14px] text-[#767676]">
              {organizer ? "You can create events and register for others." : "You can discover and register for events."}
            </p>
          </div>
        </div>
        {organizer ? (
          <Button asChild variant="brandOutline">
            <Link href="/dashboard">Manage events</Link>
          </Button>
        ) : (
          <Button variant="brand" onClick={() => setConfirming(true)}>
            Become an organizer
          </Button>
        )}
      </div>

      <AlertDialog open={confirming} onOpenChange={(open) => !saving && setConfirming(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Become an organizer?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll be able to create and manage your own events, and you can still register for other events. This
              can&apos;t be switched back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <LoadingButton variant="brand" loading={saving} onClick={upgrade}>
              Become an organizer
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InterestsEditor({ user, categories }: { user: User; categories: Category[] }) {
  const router = useRouter();
  const [interests, setInterests] = useState(user.interests);
  const [saving, setSaving] = useState(false);
  const changed = interests.length !== user.interests.length || interests.some((name) => !user.interests.includes(name));

  const save = async () => {
    setSaving(true);
    try {
      await api.updateInterests(interests);
      notifySuccess("Interests saved", "Your recommendations will follow them.");
      router.refresh();
    } catch (error) {
      notifyApiError(error, "Couldn't save your interests");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <InterestPicker categories={categories} value={interests} onChange={setInterests} disabled={saving} />
      <LoadingButton variant="brand" loading={saving} disabled={!changed} onClick={save}>
        Save interests
      </LoadingButton>
    </div>
  );
}

export function PreferencesForm({ user, categories, upgradePrompt }: PreferencesFormProps) {
  return (
    <>
      <SettingsSection title="Your role" description="Choose how you use Evento" />
      <RoleCard user={user} upgradePrompt={upgradePrompt} />
      <SettingsSection title="Interests" description="We recommend events in these categories" />
      <InterestsEditor user={user} categories={categories} />
    </>
  );
}
