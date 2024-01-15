import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { colors } from "./Utility";

export default function ColorSelect({
  height = 200,
  width = 200,
  activeColor,
  changeColor,
}) {
  const [hovered, setHovered] = useState(undefined);
  const data = colors.map((v, i) => {
    const entry = { value: 1, color: v };
    if (hovered === v || activeColor === v) {
      return {
        ...entry,
        color: v,
      };
    }
    return entry;
  });

  return (
    <div>
      <PieChart
        lineWidth={height / 4}
        radius={height / 2 - 10}
        center={[height / 2, width / 2]}
        segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
        segmentsShift={(index) => (colors[index] === activeColor ? 6 : 1)}
        viewBoxSize={[height, width]}
        labelPosition={0}
        onClick={(event, index) => {
          changeColor(
            colors[index] === activeColor ? undefined : colors[index]
          );
        }}
        data={data}
        onMouseOver={(_, index) => {
          setHovered(colors[index]);
        }}
        onMouseOut={() => {
          setHovered(undefined);
        }}
      />
    </div>
  );
}
