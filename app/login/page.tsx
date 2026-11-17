import { LoginForm } from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/navigation";

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return <LoginForm next={safeNext(searchParams.next)} />;
}
