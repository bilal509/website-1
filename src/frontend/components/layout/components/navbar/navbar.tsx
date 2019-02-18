import "./navbar.scss";

import { ViewerStore } from "store/viewer";
import { browserHistory } from "enviroment/history";
import { Link } from "components/common/link/link";
import { useEffect, useState } from "react";

const logoSvg = require("assets/images/logo.svg");

type UnenhancedProps = {};

type EnhancedProps = UnenhancedProps & {
  viewer: ViewerStore;
};

export const Navbar = ({ viewer }: EnhancedProps) => {
  const [useless, updateComponent] = useState(null);

  useEffect(() => {
    const unsubscribeFromHistory = browserHistory.listen(() => {
      updateComponent(null);
    });

    return () => {
      unsubscribeFromHistory();
    };
  });

  return (
    <nav className={"navbar"}>
      <div className={"navbar__logo"}>
        <img src={logoSvg} />
        <div>{"HyperPrivacy"}</div>
      </div>

      <div className={"interactions"}>
        {viewer.state.isLoggedIn ? (
          <>
            {browserHistory.location.pathname !== "/events" ? (
              <Link to={"/events"}>{"Events"}</Link>
            ) : null}
            {browserHistory.location.pathname !== "/user" ? (
              <Link to={"/user"}>{"Overview"}</Link>
            ) : null}
            {viewer.state.isLoggedIn ? (
              <Link
                onClick={() => {
                  viewer.logout();
                  window.location.href = "/auth/login";
                }}
              >
                {"Logout"}
              </Link>
            ) : null}
          </>
        ) : null}
      </div>
    </nav>
  );
};
