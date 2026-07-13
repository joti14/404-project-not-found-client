"use client";

import type Konva from "konva";
import { Circle, Layer, Line } from "react-konva";

interface DrawingLayerProps {
  /** Flat [x1, y1, ...] pixel coordinates of placed vertices. */
  flatPoints: number[];
  /** Current pointer position (pixels) for the rubber-band preview. */
  cursor: { x: number; y: number } | null;
  /** True once enough vertices exist to close the polygon. */
  canClose: boolean;
  onClose: () => void;
}

/** The in-progress polygon: placed vertices, a rubber-band line to the
 * cursor, and a highlighted first vertex that closes the shape. */
export function DrawingLayer({
  flatPoints,
  cursor,
  canClose,
  onClose,
}: DrawingLayerProps) {
  if (flatPoints.length === 0) return null;

  const previewPoints = cursor
    ? [...flatPoints, cursor.x, cursor.y]
    : flatPoints;

  const handleClose = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!canClose) return;
    event.cancelBubble = true;
    onClose();
  };

  return (
    <Layer>
      <Line
        points={previewPoints}
        stroke="#f59e0b"
        strokeWidth={2}
        dash={[6, 4]}
      />
      {/* vertices; index 0 is the close target */}
      {Array.from({ length: flatPoints.length / 2 }, (_, index) => {
        const isFirst = index === 0;
        return (
          <Circle
            key={index}
            x={flatPoints[index * 2]}
            y={flatPoints[index * 2 + 1]}
            radius={isFirst && canClose ? 7 : 4}
            fill={isFirst && canClose ? "#f59e0b" : "#fff"}
            stroke="#f59e0b"
            strokeWidth={2}
            hitStrokeWidth={14}
            onClick={isFirst ? handleClose : undefined}
            onTap={
              isFirst
                ? (event) =>
                    handleClose(
                      event as unknown as Konva.KonvaEventObject<MouseEvent>,
                    )
                : undefined
            }
          />
        );
      })}
    </Layer>
  );
}
