import { useEffect, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import useStore from "../../store";
import { canvasPreview } from "./canvasResize";
import "./ImageCrop.css";
import { useDrawContext } from "../Canvas/hooks/DrawProvider";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCrop() {
  const { image, height, width, aspect, crop, setCrop } = useStore();
  const { canvasRef, imgRef } = useDrawContext();

  const imgSrc = image;
  const [cropLocal, setCropLocal] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCropLocal(centerAspectCrop(width, height, aspect));
    }
  }

  const onCropConfirm = () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      canvasRef.current
    ) {
      setCrop(completedCrop);
      // We use canvasPreview as it's much faster than imgPreview.
      canvasPreview(imgRef.current, canvasRef.current, completedCrop);
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      const newCrop = centerAspectCrop(width, height, aspect);
      setCropLocal(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }, [imgRef.current]);

  useEffect(() => {
    if (imgRef.current) {
      const centeredAspectCrop = centerAspectCrop(
        imgRef.current.width,
        imgRef.current.height,
        aspect,
      );
      setCropLocal(centeredAspectCrop);
    }
  }, [aspect]);

  const isVisible =
    !crop ||
    (canvasRef.current &&
      canvasRef.current.width / canvasRef.current.height !== aspect);

  return (
    <div className={isVisible ? "" : "hidden"}>
      {!(width && height) ? (
        <div className="notice">
          Установите Высоту и Ширину холста, чтобы определить соотношение
          сторон.
        </div>
      ) : (
        <div>
          <button
            className="crop-confirm"
            onClick={onCropConfirm}
            disabled={!completedCrop}
          >
            Подтвердить выделение
          </button>
        </div>
      )}
      {!!imgSrc && (
        <ReactCrop
          crop={cropLocal}
          onChange={(_, percentCrop) => setCropLocal(percentCrop)}
          onComplete={(c) => {
            setCompletedCrop(c);
          }}
          aspect={aspect}
          minHeight={100}
        >
          <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
        </ReactCrop>
      )}
    </div>
  );
}
