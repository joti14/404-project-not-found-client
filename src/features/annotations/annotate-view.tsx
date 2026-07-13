"use client";

import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  RotateCw,
  Trash2,
  Upload,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/services/api-client";
import type { UploadedImage } from "@/types/image";

import { ImageGallery } from "./image-gallery";
import { useDeleteImage } from "./use-delete-image";
import { useImages } from "./use-images";
import { useUploadImage } from "./use-upload-image";

// Konva touches `window` at module load, so the canvas must never be
// server-rendered.
const AnnotationCanvas = dynamic(
  () => import("./annotation-canvas").then((m) => m.AnnotationCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-96 flex-1 items-center justify-center rounded-xl border bg-muted/40">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-label="Loading canvas"
        />
      </div>
    ),
  },
);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // mirror of the backend limit

/** The annotation workspace: upload control, gallery, and preview. */
export function AnnotateView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<UploadedImage | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: images, isPending, isError, refetch, isRefetching } = useImages();
  const upload = useUploadImage();
  const deleteImage = useDeleteImage();

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

  const handleDelete = () => {
    if (!selected) return;
    deleteImage.mutate(selected.id, {
      // Selection self-heals: the effect above sees the deleted image
      // is gone from the fresh list and picks the next one (or empty).
      onSuccess: () => setConfirmingDelete(false),
    });
  };

  const errorMessage =
    clientError ??
    (upload.isError
      ? getApiErrorMessage(upload.error, "Upload failed. Please try again.")
      : deleteImage.isError
        ? getApiErrorMessage(deleteImage.error, "Could not delete the image.")
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
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={!selected || deleteImage.isPending}
            onClick={() => setConfirmingDelete(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete Image
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              The image and all polygons drawn on it will be permanently
              removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteImage.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteImage.isPending}
            >
              {deleteImage.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

          {selected ? (
            <AnnotationCanvas key={selected.id} image={selected} />
          ) : (
            <div className="flex min-h-96 flex-1 items-center justify-center rounded-xl border bg-muted/40">
              <p className="p-8 text-sm text-muted-foreground">
                Select an image to start annotating.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
