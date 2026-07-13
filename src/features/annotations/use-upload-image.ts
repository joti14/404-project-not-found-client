"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { imageService } from "@/services/image-service";

import { imageKeys } from "./use-images";

/** Upload mutation with live progress (0-100). */
export function useUploadImage() {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => imageService.uploadImage(file, setProgress),
    onMutate: () => setProgress(0),
    // Returning the promise keeps the mutation pending until the list
    // refetch lands, so success callbacks (e.g. auto-selecting the new
    // image) run against the fresh list, not the stale one.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: imageKeys.all }),
  });

  return { ...mutation, progress };
}
