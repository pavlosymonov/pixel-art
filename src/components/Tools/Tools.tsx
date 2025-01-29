import { ChangeEvent } from "react";
import useStore from "../../store";
import { MdOutlineFileUpload } from "react-icons/md";
import ColorPicker from "./components/ColorPicker/ColorPicker";

import "./Tools.css";

export default function Tools() {
  const { setImage } = useStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
    };
  };

  return (
    <div className="tools">
      <ul>
        <li>
          <label className="tools-button" htmlFor="uploadinput">
            <MdOutlineFileUpload size={20} />
          </label>
          <input
            id="uploadinput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </li>
        <div className="divider"></div>
        <li>
          <button>Height</button>
        </li>
        <li>
          <button>Width</button>
        </li>
        <li>
          <button>Block size</button>
        </li>
        <li>
          <ColorPicker />
        </li>
      </ul>
    </div>
  );
}
