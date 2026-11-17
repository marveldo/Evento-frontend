"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";
import { TextField } from "@/components/form/TextField";
import { api } from "@/lib/api/client";
import { passwordSchema, type PasswordValues } from "@/lib/schemas/settings";
import { notifyApiError, notifySuccess } from "@/lib/toast";

export function PasswordForm() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { new_password: "", confirm_new_password: "" },
  });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async ({ new_password }: PasswordValues) => {
    try {
      await api.updateMe({ password: new_password });
      form.reset();
      notifySuccess("Password Updated", "Your password has been changed");
    } catch (error) {
      notifyApiError(error, "Couldn't change the password");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-7">
        <TextField control={form.control} name="new_password" type="password" label="New Password" placeholder="New password" disabled={submitting} />
        <TextField control={form.control} name="confirm_new_password" type="password" label="Confirm New Password" placeholder="Confirm New password" disabled={submitting} />
        <div className="flex justify-end">
          <LoadingButton type="submit" variant="brand" className="py-6" loading={submitting}>
            Change Password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
