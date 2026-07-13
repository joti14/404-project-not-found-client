"use client";

import { useQuery } from "@tanstack/react-query";

import { imageService } from "@/services/image-service";

/** Query-key factory for the image domain. */
export const imageKeys = {
  all: ["images"] as const,
};

export function useImages() {
  return useQuery({
    queryKey: imageKeys.all,
    queryFn: imageService.getImages,
  });
}
