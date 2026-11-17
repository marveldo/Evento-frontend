"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";
import { TextField } from "@/components/form/TextField";
import { AuthCard, OrDivider } from "@/components/auth/AuthCard";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useSession } from "@/components/providers/SessionProvider";
import { api, ApiError } from "@/lib/api/client";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const { signIn } = useSession();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      signIn(await api.login(email, password));
      notifySuccess("Login Successful ❤️", "Have fun booking your tickets");
      router.push(next);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) notifyError("Invalid Credentials", "Invalid email or password");
      else notifyApiError(error, "Login failed");
    }
  };

  return (
    <AuthCard subtitle="Login to Continue using Evento">
      <GoogleButton next={next} text="signin_with" />
      <OrDivider />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-w-[326px] max-w-[452px] flex-col gap-y-6">
          <TextField control={form.control} name="email" type="email" label="Email" placeholder="Input your Email" disabled={submitting} className="italic" labelClassName="italic" />
          <TextField control={form.control} name="password" type="password" label="Password" placeholder="Input your Password" disabled={submitting} className="italic" labelClassName="italic" />
          <LoadingButton type="submit" variant="brand" size="xl" className="w-full" loading={submitting}>
            Submit
          </LoadingButton>
          <Link href="/signup" className="text-center text-[14px] italic">
            Don’t have an account? <span className="text-brand">Sign Up</span>
          </Link>
        </form>
      </Form>
    </AuthCard>
  );
}
