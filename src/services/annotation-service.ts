import { apiClient } from "@/services/api-client";
import type { Annotation, NormalizedPoint } from "@/types/annotation";

export interface CreateAnnotationPayload {
  image: number;
  points: NormalizedPoint[];
}

export const annotationService = {
  async getAnnotations(imageId: number): Promise<Annotation[]> {
    const { data } = await apiClient.get<Annotation[]>("/api/annotations/", {
      params: { image: imageId },
    });
    return data;
  },

  async createAnnotation(payload: CreateAnnotationPayload): Promise<Annotation> {
    const { data } = await apiClient.post<Annotation>(
      "/api/annotations/",
      payload,
    );
    return data;
  },

  async deleteAnnotation(id: number): Promise<void> {
    await apiClient.delete(`/api/annotations/${id}/`);
  },
};
