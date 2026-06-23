"use client";

import Image from "next/image";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  label: string;
  chooseLabel: string;
  removeLabel: string;
  emptyLabel: string;
  file: File | null;
  currentUrl?: string;
  aspect?: "square" | "wide";
  onFileChange: (file: File | null) => void;
  onRemove?: () => void;
}

export function ImageUpload({
  label,
  chooseLabel,
  removeLabel,
  emptyLabel,
  file,
  currentUrl = "",
  aspect = "wide",
  onFileChange,
  onRemove
}: ImageUploadProps): JSX.Element {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const imageUrl = previewUrl || currentUrl;
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[16/9]";

  return (
    <div>
      <p className="text-sm font-bold text-ink">{label}</p>
      <div
        className={`relative mt-2 overflow-hidden rounded-md border border-dashed border-line bg-cream ${aspectClass}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes={aspect === "square" ? "240px" : "640px"}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-ink/50">
            <ImagePlus aria-hidden="true" className="h-8 w-8" />
            <span className="text-sm font-semibold">{emptyLabel}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-8">
          <label
            htmlFor={inputId}
            className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-black text-ink transition hover:text-leaf"
          >
            <Upload aria-hidden="true" size={17} />
            {chooseLabel}
          </label>
          {imageUrl ? (
            <Button
              type="button"
              variant="danger"
              size="icon"
              onClick={() => {
                if (file) {
                  onFileChange(null);
                } else {
                  onRemove?.();
                }
              }}
              aria-label={removeLabel}
              title={removeLabel}
            >
              <Trash2 aria-hidden="true" size={17} />
            </Button>
          ) : null}
        </div>
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        className="sr-only"
      />
      {file ? (
        <p className="mt-2 truncate text-xs font-bold text-leaf">{file.name}</p>
      ) : null}
    </div>
  );
}
