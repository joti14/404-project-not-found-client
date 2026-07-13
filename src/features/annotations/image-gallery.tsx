"use client";

import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UploadedImage } from "@/types/image";

interface ImageGalleryProps {
  images: UploadedImage[];
  selectedId: number | null;
  onSelect: (image: UploadedImage) => void;
}

/**
 * Scrollable, selectable thumbnail strip. Purely presentational:
 * fetching and upload live elsewhere. Horizontal on small screens,
 * vertical sidebar on md+.
 */
export function ImageGallery({ images, selectedId, onSelect }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center text-muted-foreground md:h-full">
        <ImageIcon className="size-6" aria-hidden />
        <p className="text-sm">No images yet.</p>
        <p className="text-xs">Upload one to start annotating.</p>
      </div>
    );
  }

  return (
    <ul
      aria-label="Uploaded images"
      className="flex gap-2 overflow-x-auto pb-2 md:max-h-[70vh] md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0 md:pr-2"
    >
      {images.map((image) => {
        const selected = image.id === selectedId;
        return (
          <li key={image.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(image)}
              aria-pressed={selected}
              aria-label={`Select image ${image.id}`}
              className={cn(
                "block overflow-hidden rounded-lg border-2 transition-all",
                selected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent opacity-80 hover:opacity-100",
              )}
            >
              {/* Plain <img>: media URLs are dynamic cross-origin files
                  served by Django; next/image optimization buys nothing
                  here and would need remote-pattern config. */}
              <img
                src={image.image}
                alt={`Uploaded image ${image.id}`}
                className="size-20 object-cover md:size-24"
                loading="lazy"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
