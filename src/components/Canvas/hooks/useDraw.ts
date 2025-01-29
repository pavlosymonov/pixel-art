import { useEffect, useRef } from "react";
import useStore from "../../../store";

export default function useDraw() {
  const { image } = useStore();
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !image) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);
  }, [image]);

  return { canvasRef };
}
