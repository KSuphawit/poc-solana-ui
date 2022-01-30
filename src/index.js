import React from "react";
import ReactDOM from "react-dom";
import "styles/index.css";
import App from "./App";
import { SolanaCluster } from "constants/SolanaCluster";

ReactDOM.render(
  <React.StrictMode>
    <App cluster={SolanaCluster.DEV_NET} />
  </React.StrictMode>,
  document.getElementById("root")
);
