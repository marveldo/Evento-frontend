import Image, { type StaticImageData } from "next/image";

interface EmptyStateProps {
  image: StaticImageData;
  title: string;
  children?: React.ReactNode;
}

export function EmptyState({ image, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-y-4 p-4 text-center">
      <Image src={image} alt="" />
      <p className="font-montserrat text-[20px] font-[600] md:text-[24px]">{title}</p>
      {children && <div className="font-nunito text-[16px] font-[700]">{children}</div>}
    </div>
  );
}
