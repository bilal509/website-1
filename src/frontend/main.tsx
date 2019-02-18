import "./main.scss";

import { render } from "react-dom";
import { Provider } from "unstated";

import { Router } from "./pages/router";

const rootElement = document.getElementById("root");

render(
  <Provider>
    <Router />
  </Provider>,
  rootElement,
);
