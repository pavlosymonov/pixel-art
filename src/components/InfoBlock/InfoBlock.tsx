import { useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { rgbToHex } from "../../utils";
import { useDrawContext } from "../Canvas/hooks/DrawProvider";
import "./InfoBlock.css";

export default function InfoBlock() {
  const { blocks, paletteMap } = useDrawContext();
  const colorsCount = useMemo(() => {
    return blocks.reduce(
      (acc, row) => {
        row.forEach((block) => {
          const color = block.join(",");
          acc[color] = acc[color] ? acc[color] + 1 : 1;
        });
        return acc;
      },
      {} as { [x: string]: number },
    );
  }, [blocks, paletteMap]);

  const rows = [
    {
      id: "rows",
      title: "Кол-во строк",
      value: blocks?.length,
    },
    {
      id: "cols",
      title: "Кол-во столбцов",
      value: blocks[0]?.length,
    },
    {
      id: "colors",
      title: "Кол-во цветов",
      value: (
        <div className="info-colors">
          {Object.keys(colorsCount)
            .map<[number, string, number]>((color) => [
              paletteMap[color],
              color,
              colorsCount[color],
            ])
            .sort()
            .map(([index, color, count]) => (
              <div
                key={index}
                className="info-color-container"
                data-tooltip-id={"color-" + index}
                data-tooltip-content={rgbToHex(
                  ...(color.split(",").map((c) => +c) as [
                    number,
                    number,
                    number,
                  ]),
                )}
                data-tooltip-place="bottom"
              >
                <div className="info-color-wrapper">
                  <div
                    className="info-color"
                    style={{ backgroundColor: `rgba(${color}, .8)` }}
                  ></div>
                  <div className="info-color-number">{index}</div>
                </div>
                {count}
                <Tooltip
                  id={"color-" + index}
                  clickable
                  style={{ zIndex: 3 }}
                />
              </div>
            ))}
        </div>
      ),
    },
  ];

  return (
    <>
      {!!blocks.length && (
        <div className="info-block">
          {rows.map((row) => (
            <div key={row.id}>
              {row.title}: {row.value}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
