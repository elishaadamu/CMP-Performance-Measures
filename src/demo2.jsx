/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "./Header";
import MainContent from "./MainContent";

const HierarchicalTree = () => {
  // The JSON data from your uploaded file
  const data = {
    name: "Performance Measures",
    children: [
      {
        name: "Reduce Highway Congestion",
        children: [
          {
            name: "Travel Times",
            description: "Reduce average travel times (TTI)",
            children: [
              {
                name: "Average travel time during AM and PM peak periods",
              },
            ],
          },
          {
            name: "Delay",
            description: "Annual Peak Hours of Excessive Delay (PHED)",
            children: [
              {
                name: "Annual Hours of Peak Hours Excessive Delay (PHED)",
              },
            ],
          },
          {
            name: "Non-SOV Travel",
            description: "Percent of Non-SOV travel",
            children: [
              {
                name: "Percent of non-Single Occupant Vehicle (SOV) travel",
              },
            ],
          },
        ],
      },
      {
        name: "Improve System Reliability",
        children: [
          {
            name: "Travel Time Reliability",
            description: "Improve travel-time reliability (PTI)",
            children: [
              {
                name: "Planning Time Index (95th percentile travel time / free-flow travel time)",
              },
            ],
          },
          {
            name: "Freight Reliability",
            description: "Improve travel-time reliability (TTTR)",
            children: [
              {
                name: "Average Truck Travel Time Reliability Index (TTTRI)",
              },
            ],
          },
          {
            name: "Interstate Reliability",
            description:
              "Percent of Person-Miles Traveled on the Interstate that are reliable",
            children: [
              {
                name: "Percent of person-miles traveled on Interstate system that are reliable",
              },
            ],
          },
          {
            name: "Non-Interstate Reliability",
            description:
              "Percent of Person-Miles Traveled on the Non-Interstate that are reliable",
            children: [
              {
                name: "Percent of person-miles traveled on non-Interstate system that are reliable",
              },
            ],
          },
        ],
      },
      {
        name: "Expand Equitable Access to Transit",
        children: [
          {
            name: "Trip Length",
            description: "Average trip length by mode",
            children: [
              {
                name: "Average trip length by mode",
              },
            ],
          },
          {
            name: "EJ Access",
            description:
              "Percentage of EJ population within a ½-mile walk of transit stop",
            children: [
              {
                name: "Percentage of EJ population within a ½-mile walk of transit stop",
              },
            ],
          },
          {
            name: "Job Access",
            description:
              "Number of jobs accessible within 30 minutes by transit, walking, or biking",
            children: [
              {
                name: "Number of jobs accessible within 30 minutes by transit",
              },
            ],
          },
          {
            name: "Accessibility",
            description:
              "Percentage of population within ½ mile of transit stop",
            children: [
              {
                name: "Percentage of population within ½ mile of transit stops",
              },
            ],
          },
        ],
      },
      {
        name: "Reduce motorized fatalities and serious injuries",
        children: [
          {
            name: "Fatalities",
            description: "Total number of motor vehicle fatalities",
            children: [
              {
                name: "Total number of motor vehicle fatalities",
              },
            ],
          },
          {
            name: "Injuries",
            description: "Total number of serious injuries",
            children: [
              {
                name: "Total number of serious injuries",
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 pb-6 min-h-screen flex flex-col">
      <Header />
      <MainContent data={data} />
    </div>
  );
};

export default HierarchicalTree;







/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "./Header";
import MainContent from "./MainContent";

const HierarchicalTree = () => {
  // The JSON data from your uploaded file
  const data = {
    name: "Performance Measures",
    children: [
      {
        name: "Reduce Highway Congestion",
        children: [
          {
            name: "Travel Times",
            description: "Reduce average travel times (TTI)",
            children: [
              {
                name: "Average travel time during AM and PM peak periods",
              },
            ],
          },
          {
            name: "Delay",
            description: "Annual Peak Hours of Excessive Delay (PHED)",
            children: [
              {
                name: "Annual Hours of Peak Hours Excessive Delay (PHED)",
              },
            ],
          },
          {
            name: "Non-SOV Travel",
            description: "Percent of Non-SOV travel",
            children: [
              {
                name: "Percent of non-Single Occupant Vehicle (SOV) travel",
              },
            ],
          },
        ],
      },
      {
        name: "Improve System Reliability",
        children: [
          {
            name: "Travel Time Reliability",
            description: "Improve travel-time reliability (PTI)",
            children: [
              {
                name: "Planning Time Index (95th percentile travel time / free-flow travel time)",
              },
            ],
          },
          {
            name: "Freight Reliability",
            description: "Improve travel-time reliability (TTTR)",
            children: [
              {
                name: "Average Truck Travel Time Reliability Index (TTTRI)",
              },
            ],
          },
          {
            name: "Interstate Reliability",
            description:
              "Percent of Person-Miles Traveled on the Interstate that are reliable",
            children: [
              {
                name: "Percent of person-miles traveled on Interstate system that are reliable",
              },
            ],
          },
          {
            name: "Non-Interstate Reliability",
            description:
              "Percent of Person-Miles Traveled on the Non-Interstate that are reliable",
            children: [
              {
                name: "Percent of person-miles traveled on non-Interstate system that are reliable",
              },
            ],
          },
        ],
      },
      {
        name: "Expand Equitable Access to Transit",
        children: [
          {
            name: "Trip Length",
            description: "Average trip length by mode",
            children: [
              {
                name: "Average trip length by mode",
              },
            ],
          },
          {
            name: "EJ Access",
            description:
              "Percentage of EJ population within a ½-mile walk of transit stop",
            children: [
              {
                name: "Percentage of EJ population within a ½-mile walk of transit stop",
              },
            ],
          },
          {
            name: "Job Access",
            description:
              "Number of jobs accessible within 30 minutes by transit, walking, or biking",
            children: [
              {
                name: "Number of jobs accessible within 30 minutes by transit",
              },
            ],
          },
          {
            name: "Accessibility",
            description:
              "Percentage of population within ½ mile of transit stop",
            children: [
              {
                name: "Percentage of population within ½ mile of transit stops",
              },
            ],
          },
        ],
      },
      {
        name: "Reduce motorized fatalities and serious injuries",
        children: [
          {
            name: "Fatalities",
            description: "Total number of motor vehicle fatalities",
            children: [
              {
                name: "Total number of motor vehicle fatalities",
              },
            ],
          },
          {
            name: "Injuries",
            description: "Total number of serious injuries",
            children: [
              {
                name: "Total number of serious injuries",
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 pb-6 min-h-screen flex flex-col">
      <Header />
      <MainContent data={data} />
    </div>
  );
};

export default HierarchicalTree;
