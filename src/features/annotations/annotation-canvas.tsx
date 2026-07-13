"use client";

import type Konva from "konva";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";

import { Button } from "@/components/ui/button";
import type { NormalizedPoint } from "@/types/annotation";
import type { UploadedImage } from "@/types/image";

import { DrawingLayer } from "./drawing-layer";
import { PolygonLayer, type PixelPolygon } from "./polygon-layer";
import { useAnnotations } from "./use-annotations";
import { useCreateAnnotation } from "./use-create-annotation";
import { useDeleteAnnotation } from "./use-delete-annotation";

const MIN_POINTS = 3;
const MAX_CANVAS_HEIGHT = 560;

/** Load an HTMLImageElement for Konva to draw. */
function useHtmlImage(src: string) {
  const [element, setElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setElement(img);
    return () => {
      img.onload = null;
      setElement(null);
    };
  }, [src]);

  return element;
}

interface AnnotationCanvasProps {
  image: UploadedImage;
}

/**
 * Owns the Konva Stage and every normalized<->pixel conversion.
 * Polygons are STORED normalized (0-1) and projected onto the current
 * stage size at render time, so they stay aligned at any viewport size.
 */
export function AnnotationCanvas({ image }: AnnotationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlImage = useHtmlImage(image.image);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const [drawingPoints, setDrawingPoints] = useState<NormalizedPoint[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const annotations = useAnnotations(image.id);
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();

  const isDrawing = drawingPoints.length > 0;

  // Fit the image inside the container (and a max height), preserving
  // aspect ratio. Re-runs on every container resize.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !htmlImage) return;

    const updateSize = () => {
      const scale = Math.min(
        container.clientWidth / htmlImage.naturalWidth,
        MAX_CANVAS_HEIGHT / htmlImage.naturalHeight,
      );
      setStageSize({
        width: Math.round(htmlImage.naturalWidth * scale),
        height: Math.round(htmlImage.naturalHeight * scale),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [htmlImage]);

  // Reset interaction state when switching images.
  useEffect(() => {
    setDrawingPoints([]);
    setSelectedId(null);
    setCursor(null);
  }, [image.id]);

  // Escape cancels drawing; Delete removes the selected polygon.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawingPoints([]);
      } else if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedId !== null
      ) {
        deleteAnnotation.mutate({ id: selectedId, imageId: image.id });
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, image.id]);

  const pixelPolygons: PixelPolygon[] = useMemo(
    () =>
      (annotations.data ?? []).map((annotation) => ({
        id: annotation.id,
        flatPoints: annotation.points.flatMap(([nx, ny]) => [
          nx * stageSize.width,
          ny * stageSize.height,
        ]),
      })),
    [annotations.data, stageSize],
  );

  const drawingFlatPoints = useMemo(
    () =>
      drawingPoints.flatMap(([nx, ny]) => [
        nx * stageSize.width,
        ny * stageSize.height,
      ]),
    [drawingPoints, stageSize],
  );

  const handleStageClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (createAnnotation.isPending) return;
    const stage = event.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer || stageSize.width === 0) return;

    setSelectedId(null);
    setDrawingPoints((points) => [
      ...points,
      [pointer.x / stageSize.width, pointer.y / stageSize.height],
    ]);
  };

  const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pointer = event.target.getStage()?.getPointerPosition();
    if (pointer) setCursor(pointer);
  };

  const closePolygon = () => {
    if (drawingPoints.length < MIN_POINTS) return;
    createAnnotation.mutate(
      { image: image.id, points: drawingPoints },
      { onSuccess: () => setDrawingPoints([]) },
    );
  };

  const deleteSelected = () => {
    if (selectedId === null) return;
    deleteAnnotation.mutate({ id: selectedId, imageId: image.id });
    setSelectedId(null);
  };

  const hint = isDrawing
    ? drawingPoints.length < MIN_POINTS
      ? `${drawingPoints.length} point${drawingPoints.length === 1 ? "" : "s"} — place at least ${MIN_POINTS}, Esc to cancel`
      : `${drawingPoints.length} points — click the first point to close, Esc to cancel`
    : "Click the image to start drawing a polygon";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {createAnnotation.isPending ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" aria-hidden />
              Saving polygon…
            </span>
          ) : (
            hint
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {pixelPolygons.length} polygon{pixelPolygons.length === 1 ? "" : "s"}
          </span>
          {selectedId !== null && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
              disabled={deleteAnnotation.isPending}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Delete polygon
            </Button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex min-h-96 items-center justify-center overflow-hidden rounded-xl border bg-muted/40"
      >
        {htmlImage && stageSize.width > 0 ? (
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onClick={handleStageClick}
            onMouseMove={handleMouseMove}
            style={{ cursor: "crosshair" }}
          >
            <Layer listening={false}>
              <KonvaImage
                image={htmlImage}
                width={stageSize.width}
                height={stageSize.height}
              />
            </Layer>

            <PolygonLayer
              polygons={pixelPolygons}
              selectedId={selectedId}
              onSelect={setSelectedId}
              listening={!isDrawing}
            />

            <DrawingLayer
              flatPoints={drawingFlatPoints}
              cursor={cursor}
              canClose={drawingPoints.length >= MIN_POINTS}
              onClose={closePolygon}
            />
          </Stage>
        ) : (
          <Loader2
            className="size-6 animate-spin text-muted-foreground"
            aria-label="Loading image"
          />
        )}
      </div>
    </div>
  );
}
