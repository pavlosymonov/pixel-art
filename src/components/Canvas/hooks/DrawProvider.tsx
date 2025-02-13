import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useStore from "../../../store";
import { canvasPreview } from "../../ImageCrop/canvasResize";
import useViewTransform, { INITIAL_MATRIX } from "./useViewTransform";
import { hexToRgb } from "../../../utils";

const DrawContext = createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imgRef: React.RefObject<HTMLImageElement>;
  blocks: number[][][];
  paletteMap: { [x: string]: number };
  pixelize: () => void;
  clearCanvas: () => void;
  clearView: () => void;
}>({
  canvasRef: { current: null },
  imgRef: { current: null },
  blocks: [],
  paletteMap: {},
  pixelize: () => {},
  clearCanvas: () => {},
  clearView: () => {},
});

export const DrawProvider = ({ children }: { children: React.ReactNode }) => {
  const { image, crop, height, width, blockSize, colorPalette, setCrop } =
    useStore();
  const { apply, pan, scaleAt, clearView, pos, scale, matrix } =
    useViewTransform();
  const [blocks, setBlocks] = useState<number[][][]>([]);
  const [zoom, setZoom] = useState<{ in: boolean; x: number; y: number }>({
    in: true,
    x: 0,
    y: 0,
  });

  const paletteMap = useMemo(() => {
    return colorPalette.reduce(
      (acc, color, index) => {
        const rgbColor = hexToRgb(color);
        acc[`${rgbColor[0]},${rgbColor[1]},${rgbColor[2]}`] = index;
        return acc;
      },
      {} as { [x: string]: number },
    );
  }, [colorPalette]);

  const [mouseState, setMouseState] = useState({
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    button: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const getScaleFactor = (w: number, h: number) => {
    const scaledW = width / blockSize / w;
    const scaledH = height / blockSize / h;

    return Math.min(scaledW, scaledH);
  };

  const mouseEvent = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (event.type === "mousedown") {
      setMouseState((state) => ({ ...state, button: true }));
      if (!event.altKey) {
        canvas.style.cursor = "grabbing";
      }
    }
    if (event.type === "mouseup" || event.type === "mouseout") {
      setMouseState((state) => ({ ...state, button: false }));
      canvas.style.cursor = "default";
      // if (event.altKey) {
      //   const x = event.offsetX;
      //   const y = event.offsetY;

      //   const containerWidth = canvas.offsetWidth;
      //   const containerHeight = canvas.offsetHeight;
      //   const canvasWidth = canvas.width;
      //   const canvasHeight = canvas.height;

      //   const widthRatio = canvasWidth / containerWidth;
      //   const heightRatio = canvasHeight / containerHeight;

      //   const adjustedMouseX = x * widthRatio;
      //   const adjustedMouseY = y * heightRatio;

      //   const scaleFactor = px.getScale();
      //   const size = Math.ceil(1 / scaleFactor);

      //   const translatedMouseX =
      //     (adjustedMouseX - px.view.position.x) / px.view.scale;
      //   const translatedMouseY =
      //     (adjustedMouseY - px.view.position.y) / px.view.scale;

      //   const col = Math.floor(translatedMouseX / size);
      //   const row = Math.floor(translatedMouseY / size);

      //   if (
      //     row >= 0 &&
      //     row < px.blocks.length &&
      //     col >= 0 &&
      //     col < px.blocks[row].length
      //   ) {
      //     // Change the color of the clicked rectangle

      //     px.blocks[row][col] = [3, 100, 175];
      //     px.ctx.clearRect(0, 0, px.drawto.width, px.drawto.height);
      //     px.drawBlocks();
      //     return;
      //   }
      // } else {
      //   canvas.style.cursor = "default";
      // }
    }

    setMouseState((state) => ({
      ...state,
      oldX: state.x,
      oldY: state.y,
      x: event.offsetX,
      y: event.offsetY,
    }));
  };

  function mouseWheelEvent(event: WheelEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (event.deltaY < 0) {
      setZoom({ in: true, x, y });
    } else {
      setZoom({ in: false, x, y });
    }

    event.preventDefault();
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    if (zoom.in) {
      console.log("Fires: 1");
      scaleAt({ x: zoom.x, y: zoom.y }, 1.1, canvasRef.current);
    } else {
      console.log("Fires: 2");
      scaleAt({ x: zoom.x, y: zoom.y }, 1 / 1.1, canvasRef.current);
    }
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", mouseEvent);
    canvas.addEventListener("mousedown", mouseEvent);
    canvas.addEventListener("mouseup", mouseEvent);
    canvas.addEventListener("mouseout", mouseEvent);
    canvas.addEventListener("wheel", mouseWheelEvent);

    return () => {
      canvas.removeEventListener("mousemove", mouseEvent);
      canvas.removeEventListener("mousedown", mouseEvent);
      canvas.removeEventListener("mouseup", mouseEvent);
      canvas.removeEventListener("mouseout", mouseEvent);
      canvas.removeEventListener("wheel", mouseWheelEvent);
    };
  }, [blocks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mouseState.button) {
      // pan if button down
      pan({
        x: mouseState.x - mouseState.oldX,
        y: mouseState.y - mouseState.oldY,
      });
    }
  }, [mouseState]);

  const colorSim = (rgbColor: number[], compareColor: number[]) => {
    let i;
    let max;
    let d = 0;
    for (i = 0, max = rgbColor.length; i < max; i++) {
      d += (rgbColor[i] - compareColor[i]) * (rgbColor[i] - compareColor[i]);
    }
    return Math.sqrt(d);
  };

  /**
   * given actualColor, check from the paletteColors the most aproximated color
   * @param {array} actualColor rgb color to compare [int,int,int]
   * @returns {array} aproximated rgb color
   */
  const similarColor = (actualColor: number[]) => {
    if (!colorPalette.length) return;

    let selectedColor: number[] = [];
    let currentSim = colorSim(actualColor, hexToRgb(colorPalette[0]));
    let nextColor;

    colorPalette.forEach((color) => {
      nextColor = colorSim(actualColor, hexToRgb(color));
      if (nextColor <= currentSim) {
        selectedColor = hexToRgb(color);
        currentSim = nextColor;
      }
    });
    return selectedColor;
  };

  const _generateBlocks = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    const w = canvas.width;
    const h = canvas.height;

    const scaleFactor = getScaleFactor(w, h);
    const pixelSize = Math.ceil(1 / scaleFactor);

    const imgPixels = ctx.getImageData(0, 0, w, h);
    const blocks = [];

    for (let y = 0; y < imgPixels.height; y += pixelSize) {
      const rowResults = [];
      for (let x = 0; x < imgPixels.width; x += pixelSize) {
        // extracting the position of the sample pixel
        const pixelIndexPosition = (x + y * imgPixels.width) * 4;
        const finalcolor = similarColor([
          imgPixels.data[pixelIndexPosition],
          imgPixels.data[pixelIndexPosition + 1],
          imgPixels.data[pixelIndexPosition + 2],
        ]);

        if (!finalcolor) {
          continue;
        }

        rowResults.push([finalcolor[0], finalcolor[1], finalcolor[2]]);
      }
      blocks.push(rowResults);
    }

    return blocks;
  };

  const _drawBlocks = (
    w: number,
    h: number,
    ctx: CanvasRenderingContext2D,
    blocks: number[][][],
  ) => {
    const scaleFactor = getScaleFactor(w, h);
    const pixelSize = Math.ceil(1 / scaleFactor);

    if (blocks.length) {
      for (let row = 0; row < blocks.length; row++) {
        for (let col = 0; col < blocks[row].length; col++) {
          const x = col * pixelSize,
            y = row * pixelSize;
          const [r, g, b] = blocks[row][col];

          // Draw rectangle
          let fillColor = `rgb(${r}, ${g}, ${b})`;
          if (scale > 3) {
            fillColor = `rgb(${Math.min(r + 75, 255)}, ${Math.min(g + 75, 255)}, ${Math.min(b + 75, 255)})`;
          }

          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, pixelSize, pixelSize);
          if (scale > 3) {
            // Draw border with specified stroke width
            ctx.lineWidth = 0.5; // Set the stroke width to 2 pixels
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, pixelSize, pixelSize);

            // Draw color index text
            ctx.fillStyle = "black";
            ctx.font = `${pixelSize / 2}px Arial`;
            ctx.textAlign = "center"; // Add this line
            ctx.textBaseline = "middle"; // Add this line
            const str = `${r},${g},${b}`;
            ctx.fillText(
              String(paletteMap[str]),
              x + pixelSize / 2,
              y + pixelSize / 2,
            );
          }
        }
      }
    }
  };

  const pixelize = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !crop) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);

    canvasPreview(imgRef.current, canvasRef.current, crop);
    const blocks = _generateBlocks(canvas, ctx);
    setBlocks(blocks);
    _drawBlocks(canvas.clientWidth, canvas.clientHeight, ctx, blocks);
  }, [crop, width, height, blockSize, colorPalette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (blocks.length) {
      apply();
    }
  }, [pos, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(new DOMMatrix(INITIAL_MATRIX));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(new DOMMatrix(matrix));

    _drawBlocks(canvas.width, canvas.height, ctx, blocks);
  }, [matrix]);

  const clearCanvas = useCallback(() => {
    setCrop(null);
    setBlocks([]);
    setMouseState({
      x: 0,
      y: 0,
      oldX: 0,
      oldY: 0,
      button: false,
    });
    clearView();

    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  return (
    <DrawContext.Provider
      value={{
        canvasRef,
        imgRef,
        blocks,
        paletteMap,
        pixelize,
        clearCanvas,
        clearView,
      }}
    >
      {children}
    </DrawContext.Provider>
  );
};

export const useDrawContext = () => useContext(DrawContext);
