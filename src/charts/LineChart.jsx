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

const LineChart = ({ data, title, dataKey, xAxisKey, yAxisLabel }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} tickFormatter={(tick) => tick.toString()}>
          <Label
            value={xAxisKey.charAt(0).toUpperCase() + xAxisKey.slice(1)}
            offset={-15}
            position="insideBottom"
          />
        </XAxis>
        <YAxis domain={["dataMin - 0.05", "dataMax + 0.05"]}>
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
        <Line
          type="cardinal"
          dataKey={dataKey}
          name={title}
          stroke="#16a34a"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
