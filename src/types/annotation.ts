/** Shape mirrors the Django AnnotationSerializer. */

/** One vertex as normalized coordinates in the 0-1 range. */
export type NormalizedPoint = [number, number];

export interface Annotation {
  id: number;
  image: number;
  points: NormalizedPoint[];
  created_at: string;
}
