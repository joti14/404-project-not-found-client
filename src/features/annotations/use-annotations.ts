"use client";

import { useQuery } from "@tanstack/react-query";

import { annotationService } from "@/services/annotation-service";

/** Query-key factory for the polygon domain, cached per image. */
export const annotationKeys = {
  all: ["annotations"] as const,
  byImage: (imageId: number) => [...annotationKeys.all, imageId] as const,
};

export function useAnnotations(imageId: number) {
  return useQuery({
    queryKey: annotationKeys.byImage(imageId),
    queryFn: () => annotationService.getAnnotations(imageId),
  });
}
