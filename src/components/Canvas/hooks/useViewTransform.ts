import { useCallback, useState } from "react";

export const INITIAL_MATRIX = [1, 0, 0, 1, 0, 0];

const useViewTransform = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);

  const apply = useCallback(() => {
    setMatrix((prevMatrix) => {
      const m = [...prevMatrix];
      m[3] = m[0] = scale;
      m[2] = m[1] = 0;
      m[4] = pos.x;
      m[5] = pos.y;

      return m;
    });
  }, [scale, pos]);

  const pan = useCallback((amount: { x: number; y: number }) => {
    console.log("fires");
    setPos((prevPos) => {
      // const maxX = 0;
      // const maxY = 0;
      // const minX = canvas.width - canvas.width * scale;
      // const minY = canvas.height - canvas.height * scale;

      // const newX = Math.min(maxX, Math.max(prevPos.x + amount.x, minX));
      // const newY = Math.min(maxY, Math.max(prevPos.y + amount.y, minY));

      // return { x: newX, y: newY };
      return { x: prevPos.x + amount.x, y: prevPos.y + amount.y };
    });
  }, []);

  const scaleAt = useCallback(
    (
      at: { x: number; y: number },
      amount: number,
      canvas: HTMLCanvasElement,
    ) => {
      setScale((prevScale) => {
        const containerWidth = canvas.offsetWidth;
        const containerHeight = canvas.offsetHeight;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const widthRatio = canvasWidth / containerWidth;
        const heightRatio = canvasHeight / containerHeight;

        const adjustedMouseX = at.x * widthRatio;
        const adjustedMouseY = at.y * heightRatio;

        const newScale = prevScale * amount;
        if (newScale < 1 || newScale > 6) return prevScale;

        setPos((prevPos) => {
          // const newX = adjustedMouseX - (adjustedMouseX - prevPos.x) * amount;
          // const newY = adjustedMouseY - (adjustedMouseY - prevPos.y) * amount;

          // const maxX = 0;
          // const maxY = 0;
          // const minX = canvasWidth - canvasWidth * newScale;
          // const minY = canvasHeight - canvasHeight * newScale;

          // return {
          //   x: Math.min(maxX, Math.max(newX, minX)),
          //   y: Math.min(maxY, Math.max(newY, minY)),
          // };
          const res = {
            x: adjustedMouseX - (adjustedMouseX - prevPos.x) * amount,
            y: adjustedMouseY - (adjustedMouseY - prevPos.y) * amount,
          };
          return res;
        });

        return newScale;
      });
    },
    [scale, pos],
  );

  const clearView = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  return {
    apply,
    pan,
    scaleAt,
    clearView,
    scale,
    pos,
    matrix,
  };
};

export default useViewTransform;
