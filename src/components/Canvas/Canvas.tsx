import useStore from "../../store";
import ImageCrop from "../ImageCrop/ImageCrop";
import "./Canvas.css";
import { useDrawContext } from "./hooks/DrawProvider";

export default function Canvas() {
  const { image, crop, aspect } = useStore();
  const { canvasRef } = useDrawContext();

  return (
    <div>
      {image &&
        (!crop ||
          (canvasRef.current &&
            canvasRef.current.width / canvasRef.current.height !== aspect)) && (
          <ImageCrop canvasRef={canvasRef} />
        )}
      <canvas className="canvas" ref={canvasRef}></canvas>
      {!image && (
        <div className="canvas__placeholder">
          <p>Загрузите изображение чтобы начать</p>
        </div>
      )}
    </div>
  );
}
