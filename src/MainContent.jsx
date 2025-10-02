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

  const handleObjectiveClick = (objectiveName) => {
    setActiveObjectiveName(objectiveName);
    const newActiveObjective = objectives.find((o) => o.name === objectiveName);
    const newMeasures = newActiveObjective?.children || [];
    setIsSidebarOpen(false); // Close sidebar on new objective selection
    setActiveMeasureName(newMeasures[0]?.name);
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
      };

      const loadedData = {};
      for (const key in dataSources) {
        try {
          const csvData = await d3.csv(dataSources[key]);
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
        component: LineChart,
        props: {
          data: chartData["Travel Times"],
          title: "Average Travel Time Index (TTI)",
          lines: [
            { key: "AM", name: "AM Peak", color: "#8884d8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ],
          xAxisKey: "year",
          yAxisLabel: "Travel Time Index",
        },
      },
      "Travel Time Reliability": {
        component: LineChart,
        props: {
          data: chartData["Travel Time Reliability"],
          title: "Planning Time Index (PTI)",
          lines: [
            { key: "AM", name: "AM Peak", color: "#8884d8" },
            { key: "PM", name: "PM Peak", color: "#82ca9d" },
          ],
          xAxisKey: "Year",
          yAxisLabel: "Commute Time (minutes)",
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
          ],
          lines: [
            {
              key: "overall",
              name: "Overall",
              color: "#333333",
              yAxisId: "left",
            },
          ],
          xAxisKey: "year",
          yAxisLabel: "Commute Time (minutes)",
        },
      },
      Fatalities: {
        component: ComposedChart,
        props: {
          data: chartData["Fatalities"],
          title: "Safety Performance",
          bars: [
            { key: "Fatalities", name: "Fatalities", color: "#8884d8" },
            { key: "SI", name: "Serious Injuries", color: "#82ca9d" },
            {
              key: "nm_fsi",
              name: "Non-Motorized FSI",
              color: "#ffc658",
            },
          ],
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
          ],
          xAxisKey: "year",
          yAxisLabel: "Fatalities / Serious Injuries",
          yAxisLabelRight: "Rate",
        },
      },
    }),
    [chartData]
  ); // Dependency array for useMemo

  const renderChart = () => {
    const config = chartConfig[activeMeasure.name];
    if (!config || !config.props.data) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      );
    }
    const ChartComponent = config.component;
    return <ChartComponent {...config.props} />;
  };

  const goalColors = ["#b6cb1a", "#f87c01", "#0481f7", "#3cbcb6", "#e34c00"]; // Moved inside to be accessible

  return (
    <div className="pt-2 px-2 md:px-4 flex-grow flex flex-col relative">
      {/* Horizontal Goal Tabs */}
      <div className="border-b border-gray-200 pb-2">
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
                  : "bg-gray-100 border border-gray-500 text-gray-600 hover:bg-[var(--goal-color)] hover:text-white"
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
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg w-full"
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
            md:w-1/3 md:relative md:translate-x-0 md:bg-transparent md:p-0 md:shadow-none md:border-none
            fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white p-4 shadow-xl z-20 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Measures</h2>
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
                      ? "bg-green-200 text-green-800 font-semibold border border-green-300 shadow"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {measure.description}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Measures Content */}
          <div className="w-full md:w-2/3 flex-grow md:border-l md:border-gray-200 md:pl-3 flex flex-col min-h-[400px] md:min-h-0">
            {activeMeasure && chartConfig[activeMeasure.name] ? ( // This div below is the direct parent of the chart
              <div className="flex-grow bg-white p-2 rounded-lg shadow-inner border border-gray-200">
                {renderChart()}
              </div>
            ) : activeMeasure ? (
              <div className="bg-green-50 p-4 rounded-lg shadow-inner border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {activeMeasure.description} - Performance Measures
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  {performanceMeasureContent.map((pm) => (
                    <li key={pm.name}>{pm.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Select a measure to see its details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
