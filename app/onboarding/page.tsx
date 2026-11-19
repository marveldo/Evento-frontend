import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getCategories, load } from "@/lib/server/data";
import { getSession } from "@/lib/server/session";

export const metadata = { title: "Get started | Evento" };

export default async function OnboardingPage() {
  const session = getSession();
  if (!session) redirect("/login");
  const categories = await load(getCategories());

  return (
    <main className="mb-40 flex flex-grow items-center justify-center px-3 pt-32">
      <OnboardingFlow name={session.user.name} initialRole={session.user.role} categories={categories.data ?? []} />
    </main>
  );
}
