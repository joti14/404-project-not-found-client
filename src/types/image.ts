/** Shape mirrors the Django ImageSerializer. */

export interface UploadedImage {
  id: number;
  /** Absolute URL of the stored file. */
  image: string;
  uploaded_at: string;
}
