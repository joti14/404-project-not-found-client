"use client";

import type Konva from "konva";
import { Layer, Line } from "react-konva";

export interface PixelPolygon {
  id: number;
  /** Flat [x1, y1, x2, y2, ...] pixel coordinates for Konva. */
  flatPoints: number[];
}

interface PolygonLayerProps {
  polygons: PixelPolygon[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  /** Disabled while a new polygon is being drawn so clicks pass through. */
  listening: boolean;
}

/** Saved polygons. Purely presentational - conversion to pixels and all
 * data concerns live in AnnotationCanvas. */
export function PolygonLayer({
  polygons,
  selectedId,
  onSelect,
  listening,
}: PolygonLayerProps) {
  const handleSelect = (event: Konva.KonvaEventObject<MouseEvent>, id: number) => {
    event.cancelBubble = true;
    onSelect(id);
  };

  return (
    <Layer listening={listening}>
      {polygons.map((polygon) => {
        const selected = polygon.id === selectedId;
        return (
          <Line
            key={polygon.id}
            points={polygon.flatPoints}
            closed
            stroke={selected ? "#f59e0b" : "#38bdf8"}
            strokeWidth={selected ? 3 : 2}
            fill={selected ? "rgba(245, 158, 11, 0.25)" : "rgba(56, 189, 248, 0.2)"}
            hitStrokeWidth={12}
            onClick={(event) => handleSelect(event, polygon.id)}
            onTap={(event) =>
              handleSelect(
                event as unknown as Konva.KonvaEventObject<MouseEvent>,
                polygon.id,
              )
            }
          />
        );
      })}
    </Layer>
  );
}
