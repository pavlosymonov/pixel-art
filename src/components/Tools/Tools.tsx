import ColorPicker from "./components/ColorPicker/ColorPicker";
import Height from "./components/Height/Height";
import Width from "./components/Width/Width";

import "./Tools.css";
import BlockSize from "./components/BlockSize/BlockSize";
import PixelateButton from "./components/Pixelate/Pixelate";
import UploadImageButton from "./components/UploadImage/UploadImage";

export default function Tools() {
  return (
    <div className="tools">
      <ul>
        <li>
          <UploadImageButton />
        </li>
        <div className="divider"></div>
        <li>
          <Height />
        </li>
        <li>
          <Width />
        </li>
        <li>
          <BlockSize />
        </li>
        <div className="divider"></div>
        <li>
          <ColorPicker />
        </li>
        <li>
          <PixelateButton />
        </li>
      </ul>
    </div>
  );
}
