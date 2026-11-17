import { SettingsNav } from "@/components/settings/SettingsNav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-40 flex w-full flex-col gap-x-8 gap-y-12 pt-36 md:flex-row">
      <SettingsNav />
      {children}
    </div>
  );
}
