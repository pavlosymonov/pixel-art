import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlinePalette,
  MdOutlineSave,
} from "react-icons/md";
import useStore from "../../../../store";
import "./ColorPicker.css";

export default function ColorPickerComponent() {
  const { colorPalette, setColorPalette } = useStore();
  const [active, setActive] = useState(false);
  const [colors, setColors] = useState<string[]>(colorPalette);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null,
  );

  const handleOnChange = (color: string) => {
    if (selectedColorIndex !== null) {
      const newColors = [...colors];
      newColors[selectedColorIndex] = color;
      setColors(newColors);
    }
  };

  const handleColorSelect = (index: number) => {
    if (selectedColorIndex === index) {
      setSelectedColorIndex(null);
    } else {
      setSelectedColorIndex(index);
    }
  };

  const handleAddColor = () => {
    setColors([...colors, "#000000"]);
    setSelectedColorIndex(colors.length);
  };

  const handleSavePalette = () => {
    setColorPalette(colors);
  };

  const handleDeleteColor = () => {
    if (selectedColorIndex !== null) {
      const newColors = [...colors];
      newColors.splice(selectedColorIndex, 1);
      setColors(newColors);
      let nextColorIndex: number | null = 0;

      if (selectedColorIndex) {
        if (selectedColorIndex == 1 && colors.length > 2) {
          nextColorIndex = 1;
        } else {
          nextColorIndex = selectedColorIndex - 1;
        }
      } else {
        nextColorIndex = null;
      }

      setSelectedColorIndex(nextColorIndex);
    }
  };

  const handleOnColorChangeInput = (color: string) => {
    if (selectedColorIndex === null) return;

    const newColors = [...colors];
    newColors[selectedColorIndex] = color;
    setColors(newColors);
  };

  return (
    <>
      <label className="tools-button" onClick={() => setActive(!active)}>
        <MdOutlinePalette size={20} />
      </label>
      <div className={`dropdown-menu ${active ? "active" : ""}`}>
        <div className="dropdown-menu-container">
          <h3 className="colors-title">Colors</h3>
          <div className="colors-container">
            <div className="colors-list">
              {colors.map((color, index) => (
                <div
                  key={color + index}
                  className={`color ${selectedColorIndex === index ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(index)}
                ></div>
              ))}
              <div className="divider"></div>
              <div className="color add-color" onClick={handleAddColor}>
                <MdAdd size={15} />
              </div>
              {!!selectedColorIndex && (
                <div className="color add-color" onClick={handleDeleteColor}>
                  <MdDeleteOutline size={15} />
                </div>
              )}
              <div className="color add-color" onClick={handleSavePalette}>
                <MdOutlineSave size={15} />
              </div>
            </div>
            {selectedColorIndex !== null && (
              <div className="color-picker-container">
                <HexColorPicker
                  onChange={handleOnChange}
                  color={colors[selectedColorIndex]}
                  className="color-picker"
                />
                <HexColorInput
                  color={colors[selectedColorIndex]}
                  onChange={handleOnColorChangeInput}
                  className="color-input"
                  prefixed
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
