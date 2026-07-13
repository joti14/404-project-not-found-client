"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  annotationService,
  type CreateAnnotationPayload,
} from "@/services/annotation-service";

import { annotationKeys } from "./use-annotations";

export function useCreateAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnnotationPayload) =>
      annotationService.createAnnotation(payload),
    onSuccess: (_created, { image }) =>
      queryClient.invalidateQueries({
        queryKey: annotationKeys.byImage(image),
      }),
  });
}
