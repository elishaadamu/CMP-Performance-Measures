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
        measures: "Travel Time, Delay, Drive Alone",
        name: "Congestion",
        children: [
          {
            name: "Travel Times",
            description: "Travel Time",
            children: [
              {
                name: "Average travel time during AM and PM peak periods",
              },
            ],
          },
          {
            name: "Delay",
            description: "Delay",
            children: [
              {
                name: "Annual Hours of Peak Hours Excessive Delay (PHED)",
              },
            ],
          },
          {
            name: "Non-SOV Travel",
            description: "Drive Alone",
            children: [
              {
                name: "Percent of non-Single Occupant Vehicle (SOV) travel",
              },
            ],
          },
        ],
      },
      {
        measures:
          "Reliability, Truck Reliability, Miles Traveled (Interstate),  Miles Traveled (Non-Interstate)",
        name: "Reliability",
        children: [
          {
            name: "Travel Time Reliability",
            description: "Reliability",
            children: [
              {
                name: "Planning Time Index (95th percentile travel time / free-flow travel time)",
              },
            ],
          },
          {
            name: "Freight Reliability",
            description: " Truck Reliability",
            children: [
              {
                name: "Average Truck Travel Time Reliability Index (TTTRI)",
              },
            ],
          },
          {
            name: "Interstate Reliability",
            description: "Miles Traveled (Interstate)",
            children: [
              {
                name: "Percent of person-miles traveled on Interstate system that are reliable",
              },
            ],
          },
          {
            name: "Non-Interstate Reliability",
            description: "Miles Traveled (Non-Interstate)",
            children: [
              {
                name: "Percent of person-miles traveled on non-Interstate system that are reliable",
              },
            ],
          },
        ],
      },
      {
        measures: "Trip Length, EJ-Transit Access, Transit-Job Access, Access",
        name: "Access",
        children: [
          {
            name: "Trip Length",
            description: "Trip Length",
            children: [
              {
                name: "Trip Length",
              },
            ],
          },
          {
            name: "EJ Access",
            description: "EJ-Transit Access",
            children: [
              {
                name: "EJ-Transit Access",
              },
            ],
          },
          {
            name: "Job Access",
            description: "Transit-Job Access",
            children: [
              {
                name: "Transit-Job Access",
              },
            ],
          },
          {
            name: "Accessibility",
            description: "Assess",
            children: [
              {
                name: "Percentage of population within ½ mile of transit stops",
              },
            ],
          },
        ],
      },
      {
        measures: "Fatality - Injury",
        name: "Safety",
        children: [
          {
            name: "Fatalities",
            description: "Fatality - Injury",
            children: [
              {
                name: "Fatality - Injury",
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-gray-200 pb-6 min-h-screen flex flex-col">
      <Header />
      <MainContent data={data} />
    </div>
  );
};

export default HierarchicalTree;
