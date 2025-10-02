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

const StackedBarChart = ({ data, title, keys, xAxisKey, yAxisLabel }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
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
        <YAxis>
          <Label
            value={yAxisLabel}
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ color: "black", fontWeight: "bold" }}
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
  );
};

export default StackedBarChart;
