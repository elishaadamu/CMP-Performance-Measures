import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import LineChart from "./charts/LineChart.jsx";
import BarChart from "./charts/BarChart.jsx";
import StackedBarChart from "./charts/StackedBarChart.jsx";
import ComposedChart from "./charts/ComposedChart.jsx";

const MainContent = ({ data }) => {
  const objectives = data.children;
  const [activeObjectiveName, setActiveObjectiveName] = useState(
    objectives[0]?.name
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chartData, setChartData] = useState({});
  const [activeMeasureName, setActiveMeasureName] = useState(
    objectives[0]?.children[0]?.name
  );
  const [toggledLegends, setToggledLegends] = useState({});

  const handleObjectiveClick = (objectiveName) => {
    setActiveObjectiveName(objectiveName);
    const newActiveObjective = objectives.find((o) => o.name === objectiveName);
    const newMeasures = newActiveObjective?.children || [];
    setIsSidebarOpen(false); // Close sidebar on new objective selection
    setActiveMeasureName(newMeasures[0]?.name);
  };

  const handleLegendClick = (chartName, dataKey) => {
    setToggledLegends((prevState) => {
      const chartState = prevState[chartName] || {};
      return {
        ...prevState,
        [chartName]: {
          ...chartState,
          [dataKey]: !chartState[dataKey],
        },
      };
    });
  };

  const activeObjective = objectives.find(
    (o) => o.name === activeObjectiveName
  );
  const measures = activeObjective?.children || [];
  const activeMeasure = measures.find((m) => m.name === activeMeasureName);
  const performanceMeasureContent = activeMeasure?.children || [];

  useEffect(() => {
    const fetchData = async () => {
      const dataSources = {
        "Travel Times": "data/1_tti_am_pm.csv",
        "Travel Time Reliability": "data/3_pti_am_pm.csv",
        Fatalities: "data/10_14_safety.csv",
        "Trip Length": "data/7_trip_length.csv",
        Delay: "data/18_pehd.csv",
        "Freight Reliability": "data/5_tttr.csv",

        "Non-SOV Travel": "data/27_commute_non_sov.csv",
      };

      const loadedData = {};
      for (const key in dataSources) {
        try {
          const csvData = await d3.csv(dataSources[key]);
          // Generic numeric conversion for all loaded data
          csvData.forEach((d) => {
            for (const prop in d) {
              if (!isNaN(d[prop]) && d[prop] !== "") d[prop] = +d[prop];
            }
          });
          loadedData[key] = csvData;
        } catch (error) {
          console.error(`Error loading data for ${key}:`, error);
          loadedData[key] = [];
        }
      }
      setChartData(loadedData);
    };

    fetchData();
  }, []);

  // --- Chart Configuration (moved inside to react to chartData changes) ---
  const chartConfig = React.useMemo(
    () => ({
      "Travel Times": {
        // Updated
        component: LineChart,
        props: {
          data: chartData["Travel Times"],
          title: "Average Travel Time Index (TTI)",
          lines: [
            { key: "AM", name: "AM Peak", color: "#a8a4e8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ].filter((line) => !toggledLegends["Travel Times"]?.[line.key]),
          xAxisKey: "year",
          yAxisLabel: "Travel Time Index",
          onLegendClick: (dataKey) =>
            handleLegendClick("Travel Times", dataKey),
          toggledLegends: toggledLegends["Travel Times"],
          originalLines: [
            { key: "AM", name: "AM Peak", color: "#a8a4e8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ],
        },
      },
      "Travel Time Reliability": {
        component: LineChart,
        props: {
          data: chartData["Travel Time Reliability"],
          title: "Planning Time Index (PTI)",
          lines: [
            { key: "AM", name: "AM Peak", color: "#a8a4e8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ].filter(
            (line) => !toggledLegends["Travel Time Reliability"]?.[line.key]
          ),
          xAxisKey: "year",
          yAxisLabel: "Planning Time Index",
          isPercentage: false, // Explicitly set for clarity
          onLegendClick: (dataKey) =>
            handleLegendClick("Travel Time Reliability", dataKey),
          toggledLegends: toggledLegends["Travel Time Reliability"],
          originalLines: [
            { key: "AM", name: "AM Peak", color: "#a8a4e8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ],
        },
      },
      "Freight Reliability": {
        component: LineChart,
        props: {
          data: chartData["Freight Reliability"],
          title: "Truck Travel Time Reliability Index (TTTR)",
          lines: [
            { key: "AM", name: "AM", color: "#a8a4e8" },
            { key: "Midday", name: "Midday", color: "#82ca9d" },
            { key: "PM", name: "PM", color: "#ffc658" },
            { key: "Weekend", name: "Weekend", color: "#ff7300" },
            { key: "Overnight", name: "Overnight", color: "#d0ed57" },
          ].filter(
            (line) => !toggledLegends["Freight Reliability"]?.[line.key]
          ),
          xAxisKey: "year",
          yAxisLabel: "Truck Travel Time Reliability Index",
          onLegendClick: (dataKey) =>
            handleLegendClick("Freight Reliability", dataKey),
          toggledLegends: toggledLegends["Freight Reliability"],
          originalLines: [
            { key: "AM", name: "AM", color: "#a8a4e8" },
            { key: "Midday", name: "Midday", color: "#82ca9d" },
            { key: "PM", name: "PM", color: "#ffc658" },
            { key: "Weekend", name: "Weekend", color: "#ff7300" },
            { key: "Overnight", name: "Overnight", color: "#d0ed57" },
          ],
        },
      },
      Delay: {
        component: ComposedChart,
        props: {
          data: chartData["Delay"],
          title: "Annual Peak Hours of Excessive Delay (PHED)",
          bars: [
            { key: "PHED", name: "PHED", color: "#a8a4e8" },
            {
              key: "TotalPopulation",
              name: "TotalPopulation",
              color: "#82ca9d",
            },
          ].filter((bar) => !toggledLegends["Delay"]?.[bar.key]),
          lines: [
            {
              key: "PHEDperCapita",
              name: "PHEDperCapita",
              color: "#ff7300",
              yAxisId: "right",
            },
          ].filter((line) => !toggledLegends["Delay"]?.[line.key]),
          xAxisKey: "year",
          yAxisLabel: "PHED per Capita",
          yAxisLabelRight: "Hours Per Capita",
          yAxisTickFormatterRight: (value) => value.toFixed(3),
          onLegendClick: (dataKey) => handleLegendClick("Delay", dataKey),
          toggledLegends: toggledLegends["Delay"],
          originalSeries: [
            { key: "PHED", name: "PHED", color: "#a8a4e8", type: "bar" },
            {
              key: "TotalPopulation",
              name: "TotalPopulation",
              color: "#82ca9d",
              type: "bar",
            },
            {
              key: "PHEDperCapita",
              name: "PHEDperCapita",
              color: "#ff7300",
              type: "line",
            },
          ],
        },
      },
      "Non-SOV Travel": {
        component: LineChart,
        props: {
          data: chartData["Non-SOV Travel"],
          title: "Percent of Non-Single Occupant Vehicle (SOV) Travel",
          lines: [
            { key: "Chesterfield", name: "Chesterfield", color: "#a8a4e8" },
            {
              key: "ColonialHeights",
              name: "Colonial Heights",
              color: "#82ca9d",
            },
            { key: "Dinwiddie", name: "Dinwiddie", color: "#ffc658" },
            { key: "Hopewell", name: "Hopewell", color: "#ff7300" },
            { key: "Petersburg", name: "Petersburg", color: "#d0ed57" },
            { key: "PrinceGeorge", name: "Prince George", color: "#a4de6c" },
            { key: "MPO", name: "MPO", color: "#387908" },
          ].filter((line) => !toggledLegends["Non-SOV Travel"]?.[line.key]),
          xAxisKey: "year",
          yAxisLabel: "Non-SOV Commute Time (minutes)",
          isPercentage: true,
          legendFontSize: "12px",
          onLegendClick: (dataKey) =>
            handleLegendClick("Non-SOV Travel", dataKey),
          toggledLegends: toggledLegends["Non-SOV Travel"],
          originalLines: [
            { key: "Chesterfield", name: "Chesterfield", color: "#a8a4e8" },
            {
              key: "ColonialHeights",
              name: "Colonial Heights",
              color: "#82ca9d",
            },
            { key: "Dinwiddie", name: "Dinwiddie", color: "#ffc658" },
            { key: "Hopewell", name: "Hopewell", color: "#ff7300" },
            { key: "Petersburg", name: "Petersburg", color: "#d0ed57" },
            { key: "PrinceGeorge", name: "Prince George", color: "#a4de6c" },
            { key: "MPO", name: "MPO", color: "#387908" },
          ],
        },
      },
      "Trip Length": {
        component: ComposedChart,
        props: {
          data: chartData["Trip Length"],
          title: "Average Trip Length by Mode",
          bars: [
            { key: "DA", name: "Drive Alone", color: "#b6cb1a", stackId: "a" },
            { key: "cp", name: "Carpool", color: "#f87c01", stackId: "a" },
            {
              key: "pt",
              name: "Public Transit",
              color: "#0481f7",
              stackId: "a",
            },
          ].map((bar) => ({
            ...bar,
            // Make bar transparent if toggled, but keep it for stacking
            fill: toggledLegends["Trip Length"]?.[bar.key]
              ? "transparent"
              : bar.color,
          })),
          lines: [
            {
              key: "overall",
              name: "Overall",
              color: "#333333",
              yAxisId: "left",
            },
          ].filter((line) => !toggledLegends["Trip Length"]?.[line.key]),
          xAxisKey: "year",
          yAxisLabel: "Commute Time (minutes)",
          onLegendClick: (dataKey) => handleLegendClick("Trip Length", dataKey),
          toggledLegends: toggledLegends["Trip Length"],
          originalSeries: [
            {
              key: "DA",
              name: "Drive Alone",
              color: "#b6cb1a",
              type: "bar",
              stackId: "a",
            },
            {
              key: "cp",
              name: "Carpool",
              color: "#f87c01",
              type: "bar",
              stackId: "a",
            },
            {
              key: "pt",
              name: "Public Transit",
              color: "#0481f7",
              type: "bar",
            },
            { key: "overall", name: "Overall", color: "#333333", type: "line" },
          ],
        },
      },
      Fatalities: {
        component: ComposedChart,
        props: {
          data: chartData["Fatalities"],
          title: "Safety Performance",
          bars: [
            { key: "Fatalities", name: "Fatalities", color: "#a8a4e8" },
            { key: "SI", name: "Serious Injuries", color: "#82ca9d" },
            {
              key: "nm_fsi",
              name: "Non-Motorized FSI",
              color: "#ffc658",
            },
          ].filter((bar) => !toggledLegends["Fatalities"]?.[bar.key]),
          lines: [
            {
              key: "fat_rate",
              name: "Fatality Rate",
              color: "#ff7300",
              yAxisId: "right",
            },
            {
              key: "si_rate",
              name: "Serious Injury Rate",
              color: "#387908",
              yAxisId: "right",
            },
          ].filter((line) => !toggledLegends["Fatalities"]?.[line.key]),
          xAxisKey: "year",
          yAxisLabel: "Fatalities / Serious Injuries",
          yAxisLabelRight: "Rate",
          onLegendClick: (dataKey) => handleLegendClick("Fatalities", dataKey),
          toggledLegends: toggledLegends["Fatalities"],
          originalSeries: [
            {
              key: "Fatalities",
              name: "Fatalities",
              color: "#a8a4e8",
              type: "bar",
            },
            {
              key: "SI",
              name: "Serious Injuries",
              color: "#82ca9d",
              type: "bar",
            },
            {
              key: "nm_fsi",
              name: "Non-Motorized FSI",
              color: "#ffc658",
              type: "bar",
            },
            {
              key: "fat_rate",
              name: "Fatality Rate",
              color: "#ff7300",
              type: "line",
            },
            {
              key: "si_rate",
              name: "Serious Injury Rate",
              color: "#387908",
              type: "line",
            },
          ],
        },
      },
    }),
    [chartData, toggledLegends]
  ); // Dependency array for useMemo

  const renderChart = () => {
    const config = chartConfig[activeMeasure.name];
    if (!config || !config.props.data) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading chart data...</p>
        </div>
      );
    }
    const ChartComponent = config.component;
    return <ChartComponent {...config.props} />;
  };

  const goalColors = ["#eec722", "#6273d1", "#3799dc", "#e33bba", "#46b96e"];

  const activeObjectiveIndex = objectives.findIndex(
    (o) => o.name === activeObjectiveName
  );
  const activeGoalColor =
    goalColors[activeObjectiveIndex % goalColors.length] || "#46b96e";

  return (
    <div
      className="pt-2 px-2 md:px-4 flex-grow flex flex-col relative"
      style={{ "--active-goal-color": activeGoalColor }}
    >
      {/* Horizontal Goal Tabs */}
      <div className="border-b border-gray-700 pb-2">
        <nav
          className="-mb-px flex flex-wrap gap-4 justify-center"
          aria-label="Tabs"
        >
          {objectives.map((objective, index) => (
            <button
              key={objective.name}
              onClick={() => handleObjectiveClick(objective.name)}
              style={{
                "--goal-color": goalColors[index % goalColors.length],
              }}
              className={`${
                activeObjectiveName === objective.name
                  ? "bg-[var(--goal-color)] text-white font-semibold shadow-md"
                  : "bg-gray-800 border border-gray-600 text-gray-300 hover:bg-[var(--goal-color)] hover:text-white"
              }
               text-center py-2 px-3 rounded-t-lg
              font-medium text-base transition-all duration-300 ease-in-out
              `}
            >
              {objective.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow mt-3">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden mb-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg w-full"
          >
            {isSidebarOpen ? "Hide" : "Show"} Measures
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow gap-3 md:h-[400px]">
          {/* Sidebar for measures (subtabs) */}
          {/* Overlay on mobile, static on desktop */}
          {isSidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          <div
            className={`
            flex flex-col 
            md:w-1/3 md:relative md:translate-x-0 md:bg-transparent md:p-0 md:shadow-none
            fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gray-800 p-4 shadow-xl z-20 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <h2 className="text-xl font-bold text-gray-100 mb-3 capitalize">
              <span className="text-gray-400">Measures:</span>{" "}
              <span className="">{activeObjective?.measures}</span>
            </h2>
            <div className="space-y-2 overflow-y-auto">
              {measures.map((measure) => (
                <button
                  key={measure.name}
                  onClick={() => {
                    setActiveMeasureName(measure.name);
                    setIsSidebarOpen(false); // Close sidebar on selection
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ease-in-out ${
                    activeMeasureName === measure.name
                      ? "bg-[var(--active-goal-color)] bg-opacity-20 text-white font-semibold border border-[var(--active-goal-color)] shadow"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {measure.description}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Measures Content */}
          <div className="w-full md:w-2/3 flex-grow md:border-l md:border-gray-700 md:pl-3 flex flex-col min-h-[400px] md:min-h-0">
            {activeMeasure && chartConfig[activeMeasure.name] ? ( // This div below is the direct parent of the chart
              <div className="flex-grow bg-gray-800 p-2 rounded-lg shadow-inner border border-gray-700">
                {renderChart()}
              </div>
            ) : activeMeasure ? (
              <div className="flex-grow bg-gray-800 p-2 rounded-lg shadow-inner border border-gray-700 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-400">
                  Coming soon !!!
                </h3>
              </div>
            ) : (
              <p className="text-gray-400">
                Select a measure to see its details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
