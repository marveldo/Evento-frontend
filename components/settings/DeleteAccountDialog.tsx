"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { api } from "@/lib/api/client";
import { notifyApiError, notifySuccess } from "@/lib/toast";

export function DeleteAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteMe();
      notifySuccess("Account deleted", "Sorry to see you go");
      router.push("/");
      router.refresh();
    } catch (error) {
      notifyApiError(error, "Couldn't delete the account");
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <LoadingButton className="bg-[#F04438] text-white hover:bg-[#F04438]/90" loading={deleting} onClick={deleteAccount}>
            Delete account
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
