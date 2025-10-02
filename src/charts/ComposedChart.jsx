import React from "react";
import {
  ComposedChart as RechartsComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`Year: ${label}`}</p>
        {payload.map((pld) => {
          const color = pld.color || pld.fill;
          return (
            <div
              key={pld.dataKey}
              className="flex items-center"
              style={{ color }}
            >
              <span
                className="inline-block mr-2 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span>{`${pld.name}: ${pld.value}`}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const ComposedChart = ({
  data,
  title,
  bars,
  lines,
  xAxisKey,
  yAxisLabel,
  yAxisLabelRight,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey}>
          <Label
            value={xAxisKey.charAt(0).toUpperCase() + xAxisKey.slice(1)}
            offset={-15}
            position="insideBottom"
          />
        </XAxis>
        <YAxis yAxisId="left">
          <Label
            value={yAxisLabel}
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <YAxis yAxisId="right" orientation="right">
          <Label
            value={yAxisLabelRight}
            angle={90}
            position="insideRight"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ color: "black", fontWeight: "bold" }}
        />

        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            yAxisId="left"
            stackId={bar.stackId}
          />
        ))}

        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color}
            yAxisId={line.yAxisId}
          />
        ))}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
};

export default ComposedChart;
