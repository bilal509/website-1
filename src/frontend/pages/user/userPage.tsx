import "./userPage.scss";

import { ViewerStore } from "store/viewer";
import { DevicesStore } from "store/devices";
import { useEffect } from "react";
import { browserHistory } from "enviroment/history";

type Props = {
  devices: DevicesStore;
  viewer: ViewerStore;
};

export const UserPage = ({ viewer, devices }: Props) => {
  useEffect(() => {
    if (!devices.state.env) {
      devices.queryDevices();
    } else if (!viewer.state.isLoggedIn) {
      browserHistory.replace("/auth/login");
    }
  });

  return (
    <div className={"userPage"}>
      <div className={"container"}>
        <div className={"head"}>{"Devices"}</div>
        <div className={"devices"}>
          {devices.state.env &&
            devices.state.env.map(device => {
              return (
                <div
                  key={device.mac}
                  className={"device"}
                  onClick={() => {
                    browserHistory.push(`/events?device=${device.mac}`);
                  }}
                >
                  <div className={"head"}>
                    <span className={"name"}>{device.name}</span>
                    <span className={"mac"}>{device.mac}</span>
                  </div>
                  <div className={"description"}>{device.description}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
