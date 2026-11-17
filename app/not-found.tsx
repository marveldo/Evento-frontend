import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mb-40 flex flex-grow flex-col items-center justify-center gap-y-6 pt-40 text-center">
      <h1 className="font-montserrat text-[28px] font-[600]">Page not found</h1>
      <p className="font-nunito text-[#676767]">The event or page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild variant="brand">
        <Link href="/home">Explore events</Link>
      </Button>
    </main>
  );
}
