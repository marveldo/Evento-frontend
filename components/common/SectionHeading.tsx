export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="gap-y-4">
      {eyebrow && <p className="font-nunito text-[14px] font-[600] leading-[24px] text-[#959595]">{eyebrow}</p>}
      <h2 className="font-montserrat text-[24px] font-[700] leading-[40px] text-[#1E1E1E] md:text-[32px]">{title}</h2>
    </div>
  );
}
