export function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[793px] space-y-12 rounded-[16px] px-3 md:border md:border-[#EBEBEB] md:p-10 md:shadow-sm md:shadow-[#1018280F]">
      <h1 className="font-montserrat text-[24px] font-[600] md:text-[32px]">{title}</h1>
      {children}
    </div>
  );
}

export function SettingsSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-3">
      <h2 className="font-nunito font-[500] text-[#1E1E1E] md:text-[20px]">{title}</h2>
      <p className="font-nunito text-[#767676] md:text-[14px]">{description}</p>
    </div>
  );
}
