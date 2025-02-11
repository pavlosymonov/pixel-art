import clsx from "clsx";
import { useState } from "react";
import { TbArrowAutofitWidth } from "react-icons/tb";
import useStore from "../../../../store";
import { useDebounceEffect } from "../../../../hooks/useDebounce";
import { DEBOUNCE_DELAY } from "../../Tools.constants";

export default function WidthComponent() {
  const { width, setWidth } = useStore();
  const [inputWidth, setInputWidth] = useState(width ? width.toString() : "");
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useDebounceEffect(
    () => {
      setWidth(+inputWidth);
    },
    [inputWidth],
    DEBOUNCE_DELAY,
  );

  return (
    <label
      htmlFor="width"
      title="Ширина"
      className={clsx("input-block", isFocused && "focused")}
    >
      <TbArrowAutofitWidth size={20} />
      <div className="input-wrapper">
        <input
          id="width"
          value={inputWidth}
          onChange={(event) => setInputWidth(event.target.value)}
          type="number"
          className="size-input"
          step={1}
          placeholder="в см"
          min={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!!inputWidth && <span className="measure">см</span>}
      </div>
    </label>
  );
}
