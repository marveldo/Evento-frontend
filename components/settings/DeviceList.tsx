"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/common/LoadingButton";
import { api } from "@/lib/api/client";
import { orDash } from "@/lib/format";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { Device } from "@/lib/types";
import laptop from "@/public/laptop.webp";
import phone from "@/public/Phone.webp";
import tablet from "@/public/Tablet.webp";

const DEVICE_IMAGES = { PC: laptop, Tablet: tablet, Mobile: phone };

export function DeviceList({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  const logOut = async (id: string) => {
    setRemoving(id);
    try {
      await api.logoutDevice(id);
      notifySuccess("Device Logged Out", "That device has to log in again");
      router.refresh();
    } catch (error) {
      notifyApiError(error, "Couldn't log the device out");
    } finally {
      setRemoving(null);
    }
  };

  if (devices.length === 0) return <p className="mt-6 w-full text-center">No other devices logged in</p>;

  return (
    <div className="flex flex-col gap-y-12">
      {devices.map((device) => (
        <div key={device.id} className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Image src={DEVICE_IMAGES[device.device_type ?? "PC"] ?? laptop} height={80} width={60} alt="" />
            <p className="font-nunito text-[12px] md:text-[16px]">
              {orDash(device.device_os)} - {orDash(device.device_type)}
              {device.device_name && device.device_name !== "Other" ? ` (${device.device_name})` : ""}
            </p>
          </div>
          <LoadingButton variant="brand" className="text-[12px] md:text-[14px]" loading={removing === device.id} disabled={removing !== null} onClick={() => logOut(device.id)}>
            Logout device
          </LoadingButton>
        </div>
      ))}
    </div>
  );
}
