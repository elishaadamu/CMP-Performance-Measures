import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const CustomTooltip = ({ active, payload, label, yAxisLabel }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 bg-opacity-90 text-white p-3 border border-gray-500 rounded-lg shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        {payload.map((pld) => (
          <div
            key={pld.dataKey}
            className="flex items-center"
            style={{ color: pld.color }}
          >
            <span
              className="inline-block mr-2 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: pld.color }}
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

const LineChart = ({
  data,
  title,
  lines,
  xAxisKey,
  yAxisLabel,
  legendFontSize,
  yAxisTickFormatter,
  isPercentage,
  onLegendClick,
  toggledLegends = {},
  originalLines,
}) => {
  const legendPayload = (originalLines || lines).map((line) => ({
    value: line.name,
    type: "line",
    id: line.key,
    color: toggledLegends[line.key] ? "#ccc" : line.color,
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-3xl font-bold text-center text-[var(--chart-title-color)] mb-4">
        {title}
      </h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 20, // Increased top margin for legend
              right: 30,
              left: 60,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis
              dataKey={xAxisKey}
              tickFormatter={(tick) => tick.toString()}
              tick={{ fill: "#ccc" }}
            >
              <Label
                value={xAxisKey.charAt(0).toUpperCase() + xAxisKey.slice(1)}
                offset={-15}
                position="insideBottom"
                fill="#ccc"
              />
            </XAxis>
            <YAxis
              domain={[isPercentage ? 10 : "auto", "auto"]}
              tickCount={6}
              tickFormatter={
                yAxisTickFormatter
                  ? yAxisTickFormatter
                  : (tick) => tick.toFixed(1)
              }
              tick={{ fill: "#ccc" }}
            >
              <Label
                value={yAxisLabel}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                fill="#ccc"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip yAxisLabel={yAxisLabel} />} />
            <Legend
              verticalAlign="top"
              height={36}
              payload={legendPayload}
              onClick={(e) => onLegendClick && onLegendClick(e.id)}
              wrapperStyle={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: legendFontSize || "14px",
              }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="cardinal"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
