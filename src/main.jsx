import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TreeVisualization from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TreeVisualization></TreeVisualization>
  </StrictMode>
);
