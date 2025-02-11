import { useCallback, useState } from "react";

const useViewTransform = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [matrix, setMatrix] = useState([1, 0, 0, 1, 0, 0]);

  const apply = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const m = matrix;
      m[3] = m[0] = scale;
      m[4] = pos.x;
      m[5] = pos.y;
      setMatrix(m);

      ctx.setTransform(new DOMMatrix(m));
    },
    [scale, pos],
  );

  const pan = useCallback(
    (amount: { x: number; y: number }, canvas: HTMLCanvasElement) => {
      setPos((prevPos) => {
        const maxX = 0;
        const maxY = 0;
        const minX = canvas.width - canvas.width * scale;
        const minY = canvas.height - canvas.height * scale;

        const newX = Math.min(maxX, Math.max(prevPos.x + amount.x, minX));
        const newY = Math.min(maxY, Math.max(prevPos.y + amount.y, minY));

        return { x: newX, y: newY };
      });
    },
    [scale],
  );

  const scaleAt = useCallback(
    (
      at: { x: number; y: number },
      amount: number,
      canvas: HTMLCanvasElement,
    ) => {
      const containerWidth = canvas.offsetWidth;
      const containerHeight = canvas.offsetHeight;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const widthRatio = canvasWidth / containerWidth;
      const heightRatio = canvasHeight / containerHeight;

      const adjustedMouseX = at.x * widthRatio;
      const adjustedMouseY = at.y * heightRatio;

      setScale((prevScale) => {
        const newScale = prevScale * amount;
        if (newScale < 1 || newScale > 6) return prevScale;

        setPos((prevPos) => {
          const newX = adjustedMouseX - (adjustedMouseX - prevPos.x) * amount;
          const newY = adjustedMouseY - (adjustedMouseY - prevPos.y) * amount;

          const maxX = 0;
          const maxY = 0;
          const minX = canvas.width - canvas.width * newScale;
          const minY = canvas.height - canvas.height * newScale;

          return {
            x: Math.min(maxX, Math.max(newX, minX)),
            y: Math.min(maxY, Math.max(newY, minY)),
          };
        });

        return newScale;
      });
    },
    [],
  );

  return {
    apply,
    pan,
    scaleAt,
    scale,
    pos,
  };
};

export default useViewTransform;
