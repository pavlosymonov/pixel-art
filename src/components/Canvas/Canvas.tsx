import useStore from "../../store";
import ImageCrop from "../ImageCrop/ImageCrop";
import "./Canvas.css";
import { useDrawContext } from "./hooks/DrawProvider";

export default function Canvas() {
  const { image } = useStore();
  const { canvasRef } = useDrawContext();

  return (
    <div>
      {image && <ImageCrop />}
      <canvas className="canvas" ref={canvasRef}></canvas>
      {!image && (
        <div className="canvas__placeholder">
          <p>Загрузите изображение чтобы начать</p>
        </div>
      )}
    </div>
  );
}
