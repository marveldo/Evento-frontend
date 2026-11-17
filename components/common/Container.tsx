import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("max-[870px]:px-4 max-[1200px]:px-10 max-[1290px]:px-14 min-[1300px]:px-24", className)}>{children}</div>;
}
