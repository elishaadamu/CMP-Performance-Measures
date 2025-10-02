import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const goalColors = ["#b6cb1a", "#f87c01", "#0481f7", "#3cbcb6", "#e34c00"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 bg-opacity-90 text-white p-3 border border-gray-500 rounded-lg shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        {payload.map((pld) => (
          <div
            key={pld.dataKey}
            className="flex items-center"
            style={{ color: pld.fill }}
          >
            <span
              className="inline-block mr-2 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: pld.fill }}
            ></span>
            <span>
              {pld.name}: {parseFloat(pld.value).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StackedBarChart = ({
  data,
  title,
  keys,
  xAxisKey,
  yAxisLabel,
  onLegendClick,
  toggledLegends = {},
  originalKeys,
}) => {
  const legendPayload = (originalKeys || keys).map((key, index) => ({
    value: key.name,
    type: "square",
    id: key.key,
    color: toggledLegends[key.key]
      ? "#ccc"
      : goalColors[index % goalColors.length],
  }));
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-3xl font-bold text-center text-[var(--chart-title-color)] mb-4">
        {title}
      </h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 60, // Increased left margin
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey={xAxisKey} tick={{ fill: "#ccc" }}>
              <Label
                value={xAxisKey.charAt(0).toUpperCase() + xAxisKey.slice(1)}
                offset={-15}
                position="insideBottom"
                fill="#ccc"
              />
            </XAxis>
            <YAxis tick={{ fill: "#ccc" }}>
              <Label
                value={yAxisLabel}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                offset={-20}
                fill="#ccc"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              payload={legendPayload}
              onClick={(e) => onLegendClick && onLegendClick(e.id)}
              wrapperStyle={{ color: "#fff", fontWeight: "bold" }}
            />
            {keys.map((key, index) => (
              <Bar
                key={key.key}
                dataKey={key.key}
                stackId="a"
                name={key.name}
                fill={goalColors[index % goalColors.length]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;
