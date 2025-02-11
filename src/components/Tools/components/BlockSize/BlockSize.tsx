import { useState } from "react";
import { TbResize } from "react-icons/tb";
import useStore from "../../../../store";
import { useDebounceEffect } from "../../../../hooks/useDebounce";
import { DEBOUNCE_DELAY } from "../../Tools.constants";

export default function BlockSizeComponent() {
  const { blockSize, setBlockSize } = useStore();
  const [inputBlockSize, setInputBlockSize] = useState(
    blockSize ? blockSize.toString() : "",
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useDebounceEffect(
    () => {
      setBlockSize(+inputBlockSize);
    },
    [inputBlockSize],
    DEBOUNCE_DELAY,
  );

  return (
    <label
      htmlFor="block-size"
      title="Размер блока"
      className={`input-block ${isFocused ? "focused" : ""}`}
    >
      <TbResize size={20} />
      <div className="input-wrapper">
        <input
          id="block-size"
          value={inputBlockSize}
          onChange={(event) => setInputBlockSize(event.target.value)}
          type="number"
          className="size-input"
          step={0.1}
          min={0}
          placeholder="в см"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!!inputBlockSize && <span className="measure">см</span>}
      </div>
    </label>
  );
}
