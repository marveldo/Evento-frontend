import { LoadFailed } from "@/components/common/LoadFailed";
import { PreferencesForm } from "@/components/settings/PreferencesForm";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { getCategories, getCurrentUser, load } from "@/lib/server/data";

export const metadata = { title: "Preferences | Evento" };

export default async function PreferencesPage({ searchParams }: { searchParams: { upgrade?: string } }) {
  const [user, categories] = await Promise.all([load(getCurrentUser()), load(getCategories())]);
  const failure = user.error ?? categories.error;
  if (failure || !user.data || !categories.data) {
    return (
      <SettingsCard title="Preferences">
        <LoadFailed unavailable={failure?.unavailable ?? true} compact />
      </SettingsCard>
    );
  }

  return (
    <SettingsCard title="Preferences">
      <PreferencesForm user={user.data} categories={categories.data} upgradePrompt={searchParams.upgrade === "1"} />
    </SettingsCard>
  );
}
