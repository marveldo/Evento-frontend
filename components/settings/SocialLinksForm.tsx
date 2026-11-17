"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";
import { TextField } from "@/components/form/TextField";
import { api } from "@/lib/api/client";
import { applyFieldErrors } from "@/lib/forms";
import { socialSchema, type SocialValues } from "@/lib/schemas/settings";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { User } from "@/lib/types";

const LINKS = [
  { name: "website", label: "Website URL", placeholder: "Enter Your Website url" },
  { name: "twitter", label: "Twitter", placeholder: "Enter the URL to your Twitter page" },
  { name: "facebook", label: "Facebook", placeholder: "Enter the URL to your Facebook page" },
  { name: "instagram", label: "Instagram", placeholder: "Enter the URL to your Instagram page" },
] as const;

export function SocialLinksForm({ user }: { user: User }) {
  const router = useRouter();
  const form = useForm<SocialValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      website: user.website ?? "",
      twitter: user.twitter ?? "",
      facebook: user.facebook ?? "",
      instagram: user.instagram ?? "",
    },
  });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async (values: SocialValues) => {
    try {
      await api.updateMe(values);
      form.reset(values);
      notifySuccess("Updated Successfully", "Your links have been updated");
      router.refresh();
    } catch (error) {
      if (!applyFieldErrors(error, form.setError, LINKS.map((link) => link.name))) notifyApiError(error, "Update Failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-7">
        {LINKS.map((link) => (
          <TextField key={link.name} control={form.control} name={link.name} type="url" label={link.label} placeholder={link.placeholder} disabled={submitting} />
        ))}
        <div className="flex justify-end">
          <LoadingButton type="submit" variant="brand" className="py-6" loading={submitting}>
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
