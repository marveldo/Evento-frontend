"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import changeIcon from "@/public/CHANGE.svg";
import dropIcon from "@/public/Contained Icon.svg";

interface ImageDropzoneProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
  // When editing: the image already saved. Shown until a new file is picked.
  currentImage?: string | null;
}

export function ImageDropzone({ value, onChange, disabled, currentImage }: ImageDropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const picked = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);
  useEffect(() => () => void (picked && URL.revokeObjectURL(picked)), [picked]);
  const preview = picked ?? currentImage ?? null;

  const pick = (files: FileList | null) => {
    if (!disabled && files?.[0]) onChange(files[0]);
  };

  return (
    <div
      className="h-[278px] overflow-hidden rounded-[8px] border border-[#EBEBEB] shadow-lg shadow-[#0000000A]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        pick(event.dataTransfer.files);
      }}
    >
      {preview ? (
        <div className="relative h-full w-full">
          <Image src={preview} alt="Selected" fill unoptimized={Boolean(picked)} sizes="592px" className="object-cover" />
          <button
            type="button"
            className="absolute bottom-3 right-3"
            // A picked file is removed (back to the saved image, if any); the saved image is replaced.
            onClick={() => (picked ? onChange(undefined) : input.current?.click())}
            disabled={disabled}
            aria-label={picked ? "Remove image" : "Change image"}
          >
            <Image src={changeIcon} height={54} width={54} alt="" />
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-y-5 p-2 text-center">
          <Image src={dropIcon} height={64} width={64} alt="" />
          <p className="font-nunito text-[16px] font-[700] md:text-[20px]">Drag to upload</p>
          <p className="px-0 font-nunito text-[12px] md:px-20 md:text-[14px]">
            Dazzle the world, no magic wand needed. Just drag and drop files right here. Formats accepted are JPG, PNG or WebP.
          </p>
          <Button type="button" variant="brand" onClick={() => input.current?.click()} disabled={disabled}>
            Browse to Upload
          </Button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => pick(event.target.files)}
      />
    </div>
  );
}
