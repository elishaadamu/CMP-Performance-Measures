import React, { useState } from "react";
import LineChart from "./charts/LineChart.jsx";
import BarChart from "./charts/BarChart.jsx";
import StackedBarChart from "./charts/StackedBarChart.jsx";

const goalColors = ["#b6cb1a", "#f87c01", "#0481f7", "#3cbcb6", "#e34c00"];
const MainContent = ({ data }) => {
  const objectives = data.children;
  const [activeObjectiveName, setActiveObjectiveName] = useState(
    objectives[0]?.name
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // --- Sample Data and Chart Configuration ---
  const chartConfig = {
    "Travel Times": {
      component: LineChart,
      props: {
        data: [
          { year: 2018, value: 1.14 },
          { year: 2019, value: 1.1 },
          { year: 2020, value: 1.05 },
          { year: 2021, value: 1.08 },
          { year: 2022, value: 1.02 },
        ],
        title: "Average Travel Time Index (TTI)",
        dataKey: "value",
        xAxisKey: "year",
        yAxisLabel: "TTI",
      },
    },
    Delay: {
      component: BarChart,
      props: {
        data: [
          { year: 2018, delay: 40 },
          { year: 2019, delay: 42 },
          { year: 2020, delay: 35 },
          { year: 2021, delay: 38 },
          { year: 2022, delay: 36 },
        ],
        title: "Annual Peak Hours of Excessive Delay",
        dataKey: "delay",
        xAxisKey: "year",
        yAxisLabel: "Hours",
      },
    },
    "Non-SOV Travel": {
      component: BarChart,
      props: {
        data: [
          { year: 2018, percent: 25 },
          { year: 2019, percent: 26 },
          { year: 2020, percent: 28 },
          { year: 2021, percent: 29 },
          { year: 2022, percent: 31 },
        ],
        title: "Percent of Non-SOV Travel",
        dataKey: "percent",
        xAxisKey: "year",
        yAxisLabel: "Percentage (%)",
      },
    },
    "Job Access": {
      component: StackedBarChart,
      props: {
        data: [
          { name: "2020", transit: 4000, walking: 2400, biking: 2000 },
          { name: "2021", transit: 4500, walking: 2800, biking: 2200 },
          { name: "2022", transit: 5000, walking: 3000, biking: 2500 },
        ],
        title: "Jobs Accessible within 30 Mins",
        keys: [
          { key: "transit", name: "By Transit" },
          { key: "walking", name: "By Walking" },
          { key: "biking", name: "By Biking" },
        ],
        xAxisKey: "name",
        yAxisLabel: "Number of Jobs",
      },
    },
  };

  const renderChart = () => {
    const config = chartConfig[activeMeasure.name];
    if (!config) return null;
    const ChartComponent = config.component;
    return <ChartComponent {...config.props} />;
  };

  return (
    <div className="pt-2 px-2 md:px-4 flex-grow flex flex-col relative">
      {/* Horizontal Goal Tabs */}
      <div className="border-b border-gray-200 pb-2">
        <nav
          className="-mb-px flex flex-wrap gap-1 justify-center"
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
                  : "bg-gray-100 text-gray-600 hover:bg-[var(--goal-color)] hover:text-white"
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
