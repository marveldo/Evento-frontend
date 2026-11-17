import { DeviceList } from "@/components/settings/DeviceList";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { SettingsCard, SettingsSection } from "@/components/settings/SettingsCard";
import { LoadFailed } from "@/components/common/LoadFailed";
import { getDevices, load } from "@/lib/server/data";
import { getSession } from "@/lib/server/session";

export default async function DataAndSecurityPage() {
  const devices = await load(getDevices());
  const currentDevice = getSession()?.user.deviceId;

  return (
    <SettingsCard title="Data & Security">
      <SettingsSection title="Password" description="Set a new password for your account." />
      <PasswordForm />
      <SettingsSection
        title="Manage Devices"
        description="This displays a list of all devices currently signed in to your Evento Space. You can manage and control access by reviewing and logging out from any unfamiliar or unauthorized devices."
      />
      {devices.error ? (
        <LoadFailed unavailable={devices.error.unavailable} compact />
      ) : (
        <DeviceList devices={devices.data.filter((device) => device.id !== currentDevice)} />
      )}
    </SettingsCard>
  );
}
