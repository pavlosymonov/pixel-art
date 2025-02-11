import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import useStore from "../../../store";

function hexToRgb(hex: string) {
  // Remove the '#' if it exists
  hex = hex.replace("#", "");

  // Handle shorthand hex codes (e.g., "ABC")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values for red, green, and blue
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an object
  return [r, g, b];
}

const DrawContext = createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  drawPixels: () => void;
}>({
  canvasRef: { current: null },
  drawPixels: () => {},
});

export const DrawProvider = ({ children }: { children: React.ReactNode }) => {
  const { image, crop, height, width, blockSize, colorPalette } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const mouse = { x: 0, y: 0, oldX: 0, oldY: 0, button: false };

  // const mouseEvent = (event) => {
  //   if (event.type === "mousedown") {
  //     mouse.button = true;
  //     if (!event.altKey) {
  //       canvas.style.cursor = "grabbing";
  //     }
  //   }
  //   if (event.type === "mouseup" || event.type === "mouseout") {
  //     mouse.button = false;
  //     if (event.altKey) {
  //       const x = event.offsetX;
  //       const y = event.offsetY;

  //       const containerWidth = px.drawto.offsetWidth;
  //       const containerHeight = px.drawto.offsetHeight;
  //       const canvasWidth = px.drawto.width;
  //       const canvasHeight = px.drawto.height;

  //       const widthRatio = canvasWidth / containerWidth;
  //       const heightRatio = canvasHeight / containerHeight;

  //       const adjustedMouseX = x * widthRatio;
  //       const adjustedMouseY = y * heightRatio;

  //       const scaleFactor = px.getScale();
  //       const size = Math.ceil(1 / scaleFactor);

  //       const translatedMouseX =
  //         (adjustedMouseX - px.view.position.x) / px.view.scale;
  //       const translatedMouseY =
  //         (adjustedMouseY - px.view.position.y) / px.view.scale;

  //       const col = Math.floor(translatedMouseX / size);
  //       const row = Math.floor(translatedMouseY / size);

  //       if (
  //         row >= 0 &&
  //         row < px.blocks.length &&
  //         col >= 0 &&
  //         col < px.blocks[row].length
  //       ) {
  //         // Change the color of the clicked rectangle

  //         px.blocks[row][col] = [3, 100, 175];
  //         px.ctx.clearRect(0, 0, px.drawto.width, px.drawto.height);
  //         px.drawBlocks();
  //         return;
  //       }
  //     } else {
  //       canvas.style.cursor = "default";
  //     }
  //   }
  //   mouse.oldX = mouse.x;
  //   mouse.oldY = mouse.y;
  //   mouse.x = event.offsetX;
  //   mouse.y = event.offsetY;
  //   if (mouse.button) {
  //     // pan if button down
  //     px.view.pan({ x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY });
  //   }
  // };

  // function mouseWheelEvent(event) {
  //   const x = event.offsetX;
  //   const y = event.offsetY;
  //   if (event.deltaY < 0) {
  //     px.view.scaleAt({ x, y }, 1.1);
  //   } else {
  //     px.view.scaleAt({ x, y }, 1 / 1.1);
  //   }
  //   event.preventDefault();
  // }

  useEffect(() => {
    // const canvas = canvasRef.current!;
    // canvas.addEventListener("mousemove", mouseEvent);
    // canvas.addEventListener("mousedown", mouseEvent);
    // canvas.addEventListener("mouseup", mouseEvent);
    // canvas.addEventListener("mouseout", mouseEvent);
    // canvas.addEventListener("wheel", mouseWheelEvent);
  }, []);

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

    const scaledW = width / blockSize / w;
    const scaledH = height / blockSize / h;
    const scaleFactor = Math.min(scaledW, scaledH);
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

  const drawPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !image) return;

    const blocks = _generateBlocks(canvas, ctx);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const scaledW = width / blockSize / w;
    const scaledH = height / blockSize / h;
    const scaleFactor = Math.min(scaledW, scaledH);
    const pixelSize = Math.ceil(1 / scaleFactor);

    if (blocks.length) {
      for (let row = 0; row < blocks.length; row++) {
        for (let col = 0; col < blocks[row].length; col++) {
          const x = col * pixelSize,
            y = row * pixelSize;
          const [r, g, b] = blocks[row][col];

          // Draw rectangle
          const fillColor = `rgb(${r}, ${g}, ${b})`;
          // if (this.view.scale > 3) {
          //   fillColor = `rgb(${Math.min(r + 75, 255)}, ${Math.min(g + 75, 255)}, ${Math.min(b + 75, 255)})`;
          // }

          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, pixelSize, pixelSize);
          // if (this.view.scale > 3) {
          //   // Draw border with specified stroke width
          //   this.ctx.lineWidth = 0.5; // Set the stroke width to 2 pixels
          //   this.ctx.strokeStyle = "black";
          //   this.ctx.strokeRect(x, y, size, size);

          //   // Draw color index text
          //   this.ctx.fillStyle = "black";
          //   this.ctx.font = `${size / 2}px Arial`;
          //   this.ctx.textAlign = "center"; // Add this line
          //   this.ctx.textBaseline = "middle"; // Add this line
          //   const str = `${r},${g},${b}`;
          //   this.ctx.fillText(
          //     this._paletteMap[str],
          //     x + size / 2,
          //     y + size / 2,
          //   );
          // }
        }
      }
    }
  }, [crop]);

  return (
    <DrawContext.Provider value={{ canvasRef, drawPixels }}>
      {children}
    </DrawContext.Provider>
  );
};

export const useDrawContext = () => useContext(DrawContext);
