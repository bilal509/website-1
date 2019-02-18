import React, { memo } from "react";
import { Router as BrowserRouter, Switch, Route } from "react-router-dom";

import queryString from "query-string";

import { browserHistory } from "enviroment/history";
import RouterPaths from "paths.config.json";
import { HomePage } from "./home/homePage";
import { LoginPage } from "./login/loginPage";
import { Subscribe } from "unstated";
import { ViewerStore } from "store/viewer";
import { UserPage } from "./user/userPage";
import { DevicesStore } from "store/devices";
import { EventsStore } from "store/events";
import { EventsPage } from "./events/eventsPage";
import { Layout } from "components/layout/layout";

export const Router = memo(() => {
  return (
    <BrowserRouter history={browserHistory}>
      <Layout>
        <Subscribe to={[EventsStore]}>
          {(events: EventsStore) => {
            return null;
          }}
        </Subscribe>
        <Switch>
          <Route
            exact
            path={RouterPaths.userPage}
            render={() => {
              return (
                <Subscribe to={[ViewerStore, DevicesStore]}>
                  {(viewer: ViewerStore, devices: DevicesStore) => {
                    return <UserPage devices={devices} viewer={viewer} />;
                  }}
                </Subscribe>
              );
            }}
          />
          <Route
            exact
            path={RouterPaths.loginPage}
            render={() => {
              return (
                <Subscribe to={[ViewerStore, DevicesStore]}>
                  {(viewer: ViewerStore, devices: DevicesStore) => {
                    return <LoginPage devices={devices} viewer={viewer} />;
                  }}
                </Subscribe>
              );
            }}
          />
          <Route
            exact
            path={RouterPaths.eventsPage}
            render={({ location }) => {
              return (
                <Subscribe to={[ViewerStore, DevicesStore, EventsStore]}>
                  {(
                    viewer: ViewerStore,
                    devices: DevicesStore,
                    events: EventsStore,
                  ) => {
                    return (
                      <EventsPage
                        deviceId={
                          queryString.parse(location.search)["device"] as string
                        }
                        devices={devices}
                        viewer={viewer}
                        events={events}
                      />
                    );
                  }}
                </Subscribe>
              );
            }}
          />
          <Route
            path={RouterPaths.homePage}
            render={() => {
              return <HomePage />;
            }}
          />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
});
