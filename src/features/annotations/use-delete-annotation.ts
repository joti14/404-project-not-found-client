"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { annotationService } from "@/services/annotation-service";

import { annotationKeys } from "./use-annotations";

interface DeleteAnnotationVariables {
  id: number;
  /** The image whose polygon list changed. */
  imageId: number;
}

export function useDeleteAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteAnnotationVariables) =>
      annotationService.deleteAnnotation(id),
    onSuccess: (_data, { imageId }) =>
      queryClient.invalidateQueries({
        queryKey: annotationKeys.byImage(imageId),
      }),
  });
}
