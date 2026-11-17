import { ProfileForm } from "@/components/settings/ProfileForm";
import { SettingsCard, SettingsSection } from "@/components/settings/SettingsCard";
import { SocialLinksForm } from "@/components/settings/SocialLinksForm";
import { LoadFailed } from "@/components/common/LoadFailed";
import { getCurrentUser, load } from "@/lib/server/data";

export default async function AccountSettingsPage() {
  const loaded = await load(getCurrentUser());
  if (loaded.error) {
    return (
      <SettingsCard title="Account">
        <LoadFailed unavailable={loaded.error.unavailable} compact />
      </SettingsCard>
    );
  }
  const user = loaded.data;

  return (
    <SettingsCard title="Account">
      <SettingsSection title="Edit Profile" description="Customize your profile to your liking" />
      <ProfileForm user={user} />
      <SettingsSection title="Social media Links" description="Attach your social media for more visibility" />
      <SocialLinksForm user={user} />
    </SettingsCard>
  );
}
