import { useState } from "react";
import { ChromePicker, Color, ColorResult } from "react-color";
import { MdAdd, MdOutlinePalette } from "react-icons/md";
import "./ColorPicker.css";

export default function ColorPicker() {
  const [active, setActive] = useState(false);
  const [colors, setColors] = useState<string[]>([
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
  ]);
  const [selectedColor, setSelectedColor] = useState<Color>("black");

  const handleOnChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  return (
    <>
      <label className="tools-button" onClick={() => setActive(!active)}>
        <MdOutlinePalette size={20} />
      </label>
      <div className={`dropdown-menu ${active ? "active" : ""}`}>
        <div className="dropdown-menu-container">
          <div>
            <h3 className="colors-title">Colors</h3>
            <div className="colors-list">
              {colors.map((color) => (
                <div
                  key={color}
                  className="color"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
              <div className="divider"></div>
            </div>
          </div>
          <button className="tools-button">
            <MdAdd size={20} />
          </button>
          <ChromePicker
            onChange={handleOnChange}
            color={selectedColor}
            className="color-picker"
          />
        </div>
      </div>
    </>
  );
}
