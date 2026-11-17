"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { TextField } from "@/components/form/TextField";
import { useSession } from "@/components/providers/SessionProvider";
import { api } from "@/lib/api/client";
import { uploadPhoto } from "@/lib/api/photos";
import { applyFieldErrors } from "@/lib/forms";
import { profileSchema, type ProfileValues } from "@/lib/schemas/settings";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { User } from "@/lib/types";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { updateUser } = useSession();
  const fileInput = useRef<HTMLInputElement>(null);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: user.full_name ?? "", bio: user.bio ?? "" },
  });
  const submitting = form.formState.isSubmitting;

  const picture = form.watch("picture");
  const preview = useMemo(() => (picture ? URL.createObjectURL(picture) : null), [picture]);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const onSubmit = async ({ full_name, bio, picture }: ProfileValues) => {
    try {
      const profile_img = picture ? await uploadPhoto(picture, "profile") : undefined;
      const updated = await api.updateMe({ full_name, bio, profile_img });
      updateUser({ name: updated.full_name ?? "", image: updated.profile_img });
      form.reset({ full_name: updated.full_name ?? "", bio: updated.bio ?? "" });
      notifySuccess("Updated Successfully", "Your profile has been updated");
      router.refresh();
    } catch (error) {
      if (!applyFieldErrors(error, form.setError, ["full_name", "bio"])) notifyApiError(error, "Update Failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-7">
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex flex-row items-center gap-x-7">
                <UserAvatar name={user.full_name} image={preview ?? user.profile_img} className="h-[84px] w-[84px]" />
                <Button type="button" variant="brand" onClick={() => fileInput.current?.click()} disabled={submitting}>
                  Upload Picture
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => field.onChange(event.target.files?.[0])}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextField control={form.control} name="full_name" label="Full Name" placeholder="Enter Your Full Name" disabled={submitting} />
        <TextField control={form.control} name="bio" label="Short bio" placeholder="Enter Your bio" disabled={submitting} className="h-[128px]" />
        <div className="flex justify-end">
          <LoadingButton type="submit" variant="brand" className="py-6" loading={submitting}>
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
