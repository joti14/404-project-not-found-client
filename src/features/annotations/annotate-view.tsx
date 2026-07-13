"use client";

import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  RotateCw,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/services/api-client";
import type { UploadedImage } from "@/types/image";

import { ImageGallery } from "./image-gallery";
import { useImages } from "./use-images";
import { useUploadImage } from "./use-upload-image";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // mirror of the backend limit

/** The annotation workspace: upload control, gallery, and preview. */
export function AnnotateView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<UploadedImage | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const { data: images, isPending, isError, refetch, isRefetching } = useImages();
  const upload = useUploadImage();

  // Keep a sensible selection: newest image after upload/first load,
  // and never point at an image that no longer exists.
  useEffect(() => {
    if (!images || images.length === 0) {
      setSelected(null);
      return;
    }
    if (!selected || !images.some((img) => img.id === selected.id)) {
      setSelected(images[0]);
    }
  }, [images, selected]);

  const handleFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-choosing the same file
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setClientError("Image is too large (max 5 MB).");
      return;
    }
    setClientError(null);
    upload.mutate(file, {
      onSuccess: (created) => setSelected(created),
    });
  };

  const errorMessage =
    clientError ??
    (upload.isError
      ? getApiErrorMessage(upload.error, "Upload failed. Please try again.")
      : null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Annotate</h1>
          <p className="text-sm text-muted-foreground">
            Upload images and draw on them.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {errorMessage && (
            <span
              role="alert"
              className="flex items-center gap-1.5 text-sm text-destructive"
            >
              <CircleAlert className="size-4" aria-hidden />
              {errorMessage}
            </span>
          )}
          {upload.isSuccess && !errorMessage && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" aria-hidden />
              Uploaded
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Choose an image to upload"
            onChange={handleFileChosen}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={upload.isPending}
          >
            {upload.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Uploading… {upload.progress}%
              </>
            ) : (
              <>
                <Upload className="size-4" aria-hidden />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center"
        >
          <CircleAlert className="size-6 text-destructive" aria-hidden />
          <div>
            <p className="font-medium">Could not load images</p>
            <p className="text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RotateCw
              className={isRefetching ? "size-4 animate-spin" : "size-4"}
              aria-hidden
            />
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex gap-2 md:flex-col">
            <Skeleton className="size-20 md:size-24" />
            <Skeleton className="size-20 md:size-24" />
            <Skeleton className="size-20 md:size-24" />
          </div>
          <Skeleton className="h-96 flex-1 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row">
          <ImageGallery
            images={images ?? []}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />

          <div className="flex min-h-96 flex-1 items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
            {selected ? (
              // The annotation canvas replaces this preview in the next task.
              <img
                src={selected.image}
                alt={`Selected image ${selected.id}`}
                className="max-h-[70vh] max-w-full object-contain"
              />
            ) : (
              <p className="p-8 text-sm text-muted-foreground">
                Select an image to preview it here.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
