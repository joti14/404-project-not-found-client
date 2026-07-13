import { apiClient } from "@/services/api-client";
import type { UploadedImage } from "@/types/image";

export const imageService = {
  async getImages(): Promise<UploadedImage[]> {
    const { data } = await apiClient.get<UploadedImage[]>("/api/images/");
    return data;
  },

  async uploadImage(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await apiClient.post<UploadedImage>(
      "/api/images/",
      formData,
      {
        // Override the client's JSON default so axios sets the proper
        // multipart boundary for this request.
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
    );
    return data;
  },

  async deleteImage(id: number): Promise<void> {
    await apiClient.delete(`/api/images/${id}/`);
  },
};
