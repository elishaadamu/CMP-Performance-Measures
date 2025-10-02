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
  Cell,
} from "recharts";

const goalColors = ["#b6cb1a", "#f87c01", "#0481f7", "#3cbcb6", "#e34c00"];

const BarChart = ({ data, title, dataKey, xAxisKey, yAxisLabel }) => {
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
        <Bar dataKey={dataKey} name={title}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={goalColors[index % goalColors.length]}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
