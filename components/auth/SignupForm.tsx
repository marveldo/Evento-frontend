"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";
import { TextField } from "@/components/form/TextField";
import { AuthCard, OrDivider } from "@/components/auth/AuthCard";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { RolePicker } from "@/components/auth/RolePicker";
import { api } from "@/lib/api/client";
import { applyFieldErrors } from "@/lib/forms";
import { signupSchema, type SignupValues } from "@/lib/schemas/auth";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import { DEFAULT_REDIRECT } from "@/lib/navigation";

const FIELDS = ["full_name", "email", "password", "role"] as const;

export function SignupForm() {
  const router = useRouter();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: "", email: "", password: "", role: "attendee" },
  });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async (values: SignupValues) => {
    try {
      await api.signup(values);
      notifySuccess("Registration Successful", "Log in to continue");
      router.push("/login");
    } catch (error) {
      if (!applyFieldErrors(error, form.setError, FIELDS)) notifyApiError(error, "Sign up failed");
    }
  };

  return (
    <AuthCard subtitle="Sign up to Continue using Evento">
      <GoogleButton next={DEFAULT_REDIRECT} text="signup_with" />
      <OrDivider />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-w-[326px] max-w-[452px] flex-col gap-y-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="italic">How will you use Evento?</FormLabel>
                <FormControl>
                  <RolePicker value={field.value} onChange={field.onChange} disabled={submitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TextField control={form.control} name="full_name" label="Full name" placeholder="Input your full name" disabled={submitting} className="italic" labelClassName="italic" />
          <TextField control={form.control} name="email" type="email" label="Email" placeholder="Input your Email" disabled={submitting} className="italic" labelClassName="italic" />
          <TextField control={form.control} name="password" type="password" label="Password" placeholder="Input your Password" disabled={submitting} className="italic" labelClassName="italic" />
          <LoadingButton type="submit" variant="brand" size="xl" className="w-full" loading={submitting}>
            Submit
          </LoadingButton>
          <Link href="/login" className="text-center text-[14px] italic">
            Already have an account? <span className="text-brand">Log in</span>
          </Link>
        </form>
      </Form>
    </AuthCard>
  );
}
