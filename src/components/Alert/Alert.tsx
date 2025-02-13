import { useMemo } from "react";
import useStore from "../../store";
import { generateRecomendedBlockSizes } from "../../utils";

import "./Alert.css";

export default function Alert() {
  const { width, height, blockSize } = useStore();
  const wholeBlockSizes = useMemo(
    () => generateRecomendedBlockSizes(width, height),
    [width, height],
  );

  const heightRatio = height - (height % blockSize);
  const widthRatio = width - (width % blockSize);

  return (
    <div className="alert">
      {!!blockSize && !wholeBlockSizes.includes(blockSize) && (
        <div className="canvas__placeholder">
          <p>
            Внимание: Высота и/или Ширина изображения не делятся на размер
            блока.
            <br />
            Высота ({height}см) / Размер блока ({blockSize}см) ={" "}
            {heightRatio !== height && <b style={{ color: "red" }}>*</b>}
            {heightRatio}см; Ширина ({width}см) / Размер блока ({blockSize}см) ={" "}
            {widthRatio !== width && <b style={{ color: "red" }}>*</b>}
            {widthRatio}см;
            <br />
            Рекомендуемые значения: {wholeBlockSizes.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
