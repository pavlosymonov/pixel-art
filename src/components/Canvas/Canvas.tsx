import useDraw from "./hooks/useDraw";
import "./Canvas.css";

export default function Canvas() {
  const { canvasRef } = useDraw();

  return (
    <div>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </div>
  );
}
