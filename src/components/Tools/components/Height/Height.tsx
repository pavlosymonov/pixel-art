import { useState } from "react";
import { TbArrowAutofitHeight } from "react-icons/tb";
import { useDebounceEffect } from "../../../../hooks/useDebounce";
import useStore from "../../../../store";
import { DEBOUNCE_DELAY } from "../../Tools.constants";

export default function HeightComponent() {
  const { height, setHeight } = useStore();
  const [inputHeight, setInputHeight] = useState(
    height ? height.toString() : "",
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
      setHeight(+inputHeight);
    },
    [inputHeight],
    DEBOUNCE_DELAY,
  );

  return (
    <label
      htmlFor="height"
      title="Высота"
      className={`input-block ${isFocused ? "focused" : ""}`}
    >
      <TbArrowAutofitHeight size={20} />
      <div className="input-wrapper">
        <input
          value={inputHeight}
          onChange={(event) => setInputHeight(event.target.value)}
          id="height"
          type="number"
          className="size-input"
          step={1}
          min={0}
          placeholder="в см"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!!inputHeight && <span className="measure">см</span>}
      </div>
    </label>
  );
}
