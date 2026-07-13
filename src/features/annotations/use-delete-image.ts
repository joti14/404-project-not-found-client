"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { imageService } from "@/services/image-service";

import { annotationKeys } from "./use-annotations";
import { imageKeys } from "./use-images";

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => imageService.deleteImage(id),
    onSuccess: (_data, id) => {
      // The image's polygons were cascade-deleted server-side; drop
      // their now-orphaned cache entry too.
      queryClient.removeQueries({ queryKey: annotationKeys.byImage(id) });
      // Returning the promise keeps the mutation pending until the
      // gallery refetch lands, so the selection effect runs against
      // the fresh list (same pattern as upload).
      return queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
  });
}
