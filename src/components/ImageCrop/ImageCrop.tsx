import { useEffect, useRef, useState } from "react";
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

export default function ImageCrop({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const { image, height, width, aspect, setCrop } = useStore();

  const imgSrc = image;
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCropLocal] = useState<Crop>();
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

  return (
    <div>
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
          crop={crop}
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
