/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";

// imported d3 from d3 (library)
import * as d3 from "d3";

const HierarchicalTree = () => {
  // create svg ref here //
  const svgRef = useRef();

  // The JSON data from your uploaded file
  const data = {
    name: "Vision",
    children: [
      {
        name: "Reduce Highway Congestion",
        children: [
          {
            name: "Reduce average travel times (TTI)",
          },
          {
            name: "Annual Peak Hours of Excessive Delay (PHED)",
          },
          { name: "Percent of Non-SOV travel" },
        ],
      },
      {
        name: "Improve System Reliability",
        children: [
          {
            name: "Improve travel-time reliability (TTTR)",
          },
          {
            name: "Improve travel-time reliability (PTI)",
          },
          {
            name: "Percent of Person-Miles Traveled on the Interstate that are reliable",
          },
          {
            name: "Percent of Person-Miles Traveled on the Non-Interstate that are reliable",
          },
        ],
      },
      {
        name: "Expand Equitable Access to Transit",
        children: [
          {
            name: "Average trip length by mode",
          },
          {
            name: "Percentage of EJ population within a ½-mile walk of transit stop",
          },
          {
            name: "Number of jobs accessible within 30 minutes by transit, walking, or biking",
          },
          {
            name: "Percentage of population within ½ mile of transit stop",
          },
        ],
      },
      {
        name: "Reduce motorized fatalities and serious injuries",
        children: [
          {
            name: "Total number of motor vehicle fatalities",
          },
          {
            name: "Total number of serious injuries",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Set dimensions and margins
    const margin = { top: 120, right: 50, bottom: 50, left: 250 };
    const width = 2400 - margin.left - margin.right;
    const height = 1200 - margin.top - margin.bottom;
    const horizontalSpacing = 700; // Horizontal spacing between columns
    const verticalSpacing = 80; // Minimum vertical spacing between nodes
    let i = 0;
    const duration = 750;

    // --- Responsive SVG with viewBox ---
    svg
      .attr("viewBox", [
        0,
        0,
        width + margin.left + margin.right,
        height + margin.top + margin.bottom,
      ])
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Enable zoom & pan ---
    const zoomHandler = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoomHandler);

    // Create the tree layout
    const tree = d3
      .tree()
      .size([height, width])
      .separation((a, b) => {
        return (a.parent === b.parent ? 1 : 2) * verticalSpacing;
      });

    // Create diagonal path generator
    const diagonal = d3
      .linkHorizontal()
      .x((d) => (d ? d.y : 0))
      .y((d) => (d ? d.x : 0));

    // Initialize root
    const root = d3.hierarchy(data);
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse all children initially except first level
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    if (root.children) {
      collapse(root);
    }

    // Add column headers with proper spacing
    const headers = [
      { text: "Objectives", col: 1 },
      { text: "Performance Measures", col: 2 },
    ];

    g.selectAll("text.header")
      .data(headers)
      .enter()
      .append("text")
      .attr("class", "header")
      .attr("x", (d) => d.col * horizontalSpacing)
      .attr("y", -80)
      .attr("text-anchor", "middle")
      .style("font-size", "36px")
      .style("font-weight", "bold")
      .style("fill", "#1e40af")
      .text((d) => d.text);

    function update(source) {
      // Compute the new tree layout
      const treeData = tree(root);
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      // Set horizontal positions based on depth
      nodes.forEach((d) => {
        d.y = d.depth * horizontalSpacing;
      });

      // --- Add text first (to measure size) ---
      const node = g
        .selectAll("g.node")
        .data(nodes, (d) => d.id || (d.id = ++i));

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr(
          "transform",
          (d) => `translate(${source.y0 || 0},${source.x0 || 0})`
        )
        .on("click", (event, d) => {
          if (d.children || d._children) {
            toggle(d);
            update(d);
          }
        })
        .style("cursor", (d) =>
          d.children || d._children ? "pointer" : "default"
        );

      nodeEnter
        .append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "#1f2937")
        .style("pointer-events", "none")
        .text((d) => d.data.name)
        .each(function (d) {
          const textEl = d3.select(this);
          const words = d.data.name.split(/\s+/);
          const maxWidth = d.depth < 2 ? 800 : 660; // wider for first two levels
          let line = [];
          let tspan = textEl
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "0em");

          words.forEach((word) => {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > maxWidth) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = textEl
                .append("tspan")
                .attr("x", 0)
                .attr("dy", "1.2em")
                .text(word);
            }
          });

          // Save box size
          const textBox = textEl.node().getBBox();
          if (d.depth < 2) {
            d.boxWidth = textBox.width + 80;
            d.boxHeight = textBox.height + 40;
          } else {
            d.boxWidth = textBox.width + 60;
            d.boxHeight = textBox.height + 20;
          }
        });

      // Adjust vertical positions to prevent overlapping
      const nodesByDepth = {};
      nodes.forEach((d) => {
        if (!nodesByDepth[d.depth]) nodesByDepth[d.depth] = [];
        nodesByDepth[d.depth].push(d);
      });

      Object.keys(nodesByDepth).forEach((depth) => {
        nodesByDepth[depth].sort((a, b) => a.x - b.x);
        for (let i = 1; i < nodesByDepth[depth].length; i++) {
          const current = nodesByDepth[depth][i];
          const previous = nodesByDepth[depth][i - 1];
          const minDistance =
            previous.boxHeight / 2 + current.boxHeight / 2 + 40;
          if (current.x - previous.x < minDistance) {
            current.x = previous.x + minDistance;
          }
        }
      });

      // Add rectangles AFTER knowing text size
      nodeEnter
        .insert("rect", "text")
        .attr("x", (d) => -d.boxWidth / 2)
        .attr("y", (d) => -d.boxHeight / 2)
        .attr("width", (d) => d.boxWidth)
        .attr("height", (d) => d.boxHeight)
        .attr("rx", 8)
        .style("fill", (d) => {
          if (d.depth === 0) return "#e0f2fe"; // Vision
          if (d.depth === 1) return "#e8f5e8"; // Goals
          if (d.depth === 2) return "#fff3e0"; // Objectives
          return "#f3e5f5"; // PMs
        })
        .style("stroke", (d) => {
          if (d.depth === 0) return "#0369a1";
          if (d.depth === 1) return "#16a34a";
          if (d.depth === 2) return "#ea580c";
          return "#9333ea";
        })
        .style("stroke-width", "2px");

      // Add expand/collapse circle
      nodeEnter
        .append("circle")
        .attr("cx", (d) => d.boxWidth / 2 - 20)
        .attr("cy", (d) => -d.boxHeight / 2 + 20)
        .attr("r", 10)
        .style("fill", "#3b82f6")
        .style("stroke", "#1e40af")
        .style("stroke-width", "2px")
        .style("display", (d) =>
          d.children || d._children ? "block" : "none"
        );

      // Add + / − text
      nodeEnter
        .append("text")
        .attr("x", (d) => d.boxWidth / 2 - 20)
        .attr("y", (d) => -d.boxHeight / 2 + 20)
        .attr("dy", "0.50em")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .style("pointer-events", "none")
        .style("display", (d) => (d.children || d._children ? "block" : "none"))
        .text((d) => (d.children ? "−" : "+"));

      // Transition to new positions
      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select("text:last-child")
        .text((d) => (d.children ? "−" : "+"));

      // Exit nodes
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr(
          "transform",
          (d) => `translate(${source.y || 0},${source.x || 0})`
        )
        .remove();
      nodeExit.select("rect").style("fill-opacity", 1e-6);
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // Update the links
      const link = g.selectAll("path.link").data(links, (d) => d.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .style("fill", "none")
        .style("stroke", "#94a3b8")
        .style("stroke-width", "3px")
        .attr("d", (d) => {
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return diagonal({ source: o, target: o });
        });

      linkEnter
        .merge(link)
        .transition()
        .duration(duration)
        .attr("d", (d) => diagonal({ source: d.parent || d, target: d }))
        .style("stroke", "#94a3b8");

      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", (d) => {
          const o = { x: source.x || 0, y: source.y || 0 };
          return diagonal({ source: o, target: o });
        })
        .remove();

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    // Initial render
    update(root);

    // Center the initial view
    const initialX = margin.left;
    const initialY = margin.top - root.x0;
    const initialTransform = d3.zoomIdentity
      .translate(initialX, initialY)
      .scale(0.8);

    svg.call(zoomHandler.transform, initialTransform);
  }, []);

  return (
    <div className="bg-gray-50">
      <div className=" bg-gray-50 p-4 shadow-md">
        <p className="text-[25px] font-bold text-gray-900 text-center">
          CMP Performance Measures
        </p>
      </div>
      <div className="p-2">
        <div className="overflow-auto mb-6 min-h-screen">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalTree;
