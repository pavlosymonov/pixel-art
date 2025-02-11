import { BsFillPlayFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import useStore from "../../../../store";
import { useDrawContext } from "../../../Canvas/hooks/DrawProvider";

export default function PixelateButton() {
  const { height, width, blockSize, crop } = useStore();
  const { drawPixels } = useDrawContext();
  const isDisabled = !height || !width || !blockSize || !crop;

  return (
    <>
      <button
        className="tools-button"
        title="Пикселизировать"
        disabled={isDisabled}
        data-tooltip-id="pixelate"
        data-tooltip-content="Установите высоту, ширину и размер блока."
        data-tooltip-place="top"
        onClick={drawPixels}
      >
        <BsFillPlayFill size={20} />
      </button>
      {isDisabled && <Tooltip id="pixelate" style={{ zIndex: 2 }} />}
    </>
  );
}
