import "./eventsPage.scss";

import { useEffect, useState, createRef } from "react";
import classNames from "classnames";

import { ViewerStore } from "store/viewer";
import { DevicesStore } from "store/devices";
import { browserHistory } from "enviroment/history";
import { EventsStore } from "store/events";
import ReactJson from "react-json-view";
import { Device, Event } from "api/schema";
import { Button } from "components/common/button/button";

type Props = {
  devices: DevicesStore;
  viewer: ViewerStore;
  events: EventsStore;
  deviceId: string;
};

export const EventsPage = ({ viewer, devices, events, deviceId }: Props) => {
  const isMobileWidth = (width: number) => {
    return width < 1120;
  };

  const [isMobileView, setMobileView] = useState(
    isMobileWidth(window.document.documentElement.clientWidth),
  );

  const handleWindowResize = () => {
    const newIsMobileView = isMobileWidth(
      window.document.documentElement.clientWidth,
    );

    if (newIsMobileView !== isMobileView) {
      setMobileView(newIsMobileView);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, true);

    return () => {
      window.removeEventListener("resize", handleWindowResize, true);
    };
  });

  const [selectedDevice, _setSelectedDevice] = useState<null | Device>(null);

  const filters = ["recent", "type", "name"];

  const [selectedFilter, setSelectedFilter] = useState<
    "recent" | "type" | "name"
  >("recent");

  const setSelectedDevice = (device: null | Device) => {
    browserHistory.push(!device ? "/events" : `events?id=${device.mac}`);
    _setSelectedDevice(device);
  };

  const [popupData, setPopupData] = useState<null | Event>(null);

  const devicesSelctorRef = createRef<HTMLDivElement>();
  const filterSelctorRef = createRef<HTMLButtonElement>();

  const [deviceSelectorIsExpanded, setDeviceSelectorIsExpanded] = useState(
    false,
  );
  const [filterSelectorIsExpanded, setFilterSelectorIsExpanded] = useState(
    false,
  );

  const closeDeviceSelector = (event: UIEvent) => {
    if (
      devicesSelctorRef.current &&
      !devicesSelctorRef.current.contains(event.target as Node)
    ) {
      setDeviceSelectorIsExpanded(false);
    }
  };

  const closeFilterSelector = (event: UIEvent) => {
    if (
      filterSelctorRef.current &&
      !filterSelctorRef.current.contains(event.target as Node)
    ) {
      setFilterSelectorIsExpanded(false);
    }
  };

  useEffect(() => {
    if (!viewer.state.isLoggedIn) {
    }

    if (!events.state.env) {
      events.init();
    }

    if (devices.state.env) {
      if (deviceId) {
        setSelectedDevice(
          devices.state.env.find(device => {
            return device.mac === deviceId;
          })!,
        );
      }
    } else {
      devices.queryDevices();
    }

    if (deviceSelectorIsExpanded) {
      window.addEventListener("click", closeDeviceSelector, true);
    } else {
      window.removeEventListener("click", closeDeviceSelector, true);
    }

    if (filterSelectorIsExpanded) {
      window.addEventListener("click", closeFilterSelector, true);
    } else {
      window.removeEventListener("click", closeFilterSelector, true);
    }
  });

  return (
    <div className={"eventsPage"}>
      {popupData ? (
        <div
          className={"popup"}
          onClick={event => {
            setPopupData(null);
          }}
        >
          <div
            onClick={event => event.stopPropagation()}
            className={"container"}
          >
            <div className={"header"}>{`Event: ${popupData.data.msg}`}</div>
            <ReactJson name={false} src={popupData.data} sortKeys={true} />
            <div className={"footer"}>
              <Button
                onClick={event => {
                  setPopupData(null);
                }}
                primary
              >
                {"Close"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <div className={"selector"}>
        <div
          className={"head"}
          onClick={() => setDeviceSelectorIsExpanded(!deviceSelectorIsExpanded)}
          ref={devicesSelctorRef}
        >
          {!viewer.state.isAuthorized ? (
            <>
              <svg
                height="12"
                viewBox="0 0 8 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L4.70711 3.29289C4.31658 3.68342 3.68342 3.68342 3.29289 3.29289L1 1"
                  stroke="#4f4f4f"
                  strokeWidth={"1.8"}
                />
              </svg>
              {deviceSelectorIsExpanded && devices.state.env ? (
                <ul className={"devices"}>
                  {selectedDevice === null ? null : (
                    <li onClick={() => setSelectedDevice(null)}>{"Devices"}</li>
                  )}
                  {devices.state.env
                    .filter(device => {
                      if (!selectedDevice) {
                        return true;
                      }

                      return (
                        device !== null && device.mac !== selectedDevice.mac
                      );
                    })
                    .map(device => {
                      return (
                        <li
                          key={device.mac}
                          onClick={() => setSelectedDevice(device)}
                        >
                          {device.name}
                        </li>
                      );
                    })}
                </ul>
              ) : null}

              {selectedDevice ? selectedDevice.name : "Devices"}
            </>
          ) : (
            "Regulator"
          )}
        </div>
        {viewer.state.isAuthorized ? null : (
          <div className={"filter"}>
            {"sort by"}
            <button
              ref={filterSelctorRef}
              className={classNames({ "--active": filterSelectorIsExpanded })}
              onClick={() =>
                setFilterSelectorIsExpanded(!filterSelectorIsExpanded)
              }
            >
              {selectedFilter}
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L4.70711 3.29289C4.31658 3.68342 3.68342 3.68342 3.29289 3.29289L1 1"
                  stroke="#707070"
                  strokeWidth={"1.8"}
                />
              </svg>
              {filterSelectorIsExpanded ? (
                <ul className={"filters"}>
                  {filters
                    .filter(filter => {
                      return filter !== selectedFilter;
                    })
                    .map(filter => {
                      return (
                        <li
                          key={filter}
                          onClick={() => setSelectedFilter(filter as any)}
                        >
                          {filter}
                        </li>
                      );
                    })}
                </ul>
              ) : null}
            </button>
          </div>
        )}
      </div>
      <ul className={"events"}>
        {events.state.env && events.state.env.length > 0 ? (
          events.state.env
            .filter(event => {
              if (viewer.state.isAuthorized) {
                if (event.data.type === "critical") {
                  return true;
                } else {
                  return false;
                }
              }
              if (selectedDevice === null) {
                return true;
              }

              return event.device && event.device.mac === selectedDevice.mac;
            })
            .sort((first, second) => {
              switch (selectedFilter) {
                case "name": {
                  const firstValue = (
                    first.data.msg || first.data.MSG
                  ).toUpperCase();
                  const secondValue = (
                    second.data.msg || second.data.MSG
                  ).toUpperCase();

                  if (firstValue < secondValue) {
                    return -1;
                  } else if (firstValue > secondValue) {
                    return 1;
                  } else {
                    return 0;
                  }
                }
                case "recent": {
                  const firstValue = first.data.creation;
                  const secondValue = second.data.creation;

                  if (firstValue < secondValue) {
                    return 1;
                  } else if (firstValue > secondValue) {
                    return -1;
                  } else {
                    return 0;
                  }
                }
                case "type": {
                  const firstValue = first.data.type.toLowerCase();
                  const secondValue = second.data.type.toLowerCase();

                  if (firstValue < secondValue) {
                    return -1;
                  } else if (firstValue > secondValue) {
                    return 1;
                  } else {
                    return 0;
                  }
                }
              }
            })
            .map(event => {
              const date = new Date(event.data.creation);
              return (
                <li
                  className={"event"}
                  key={event.data.creation}
                  onClick={() => setPopupData(event)}
                >
                  <div className={"name"}>
                    {event.data.msg || event.data.MSG}
                  </div>
                  {!isMobileView && event.data ? (
                    <div className={"json"}>
                      <div className={"container"}>{`JSON: ${JSON.stringify(
                        event.data,
                      )}`}</div>
                    </div>
                  ) : null}
                  {!isMobileView ? (
                    <div
                      className={"creation"}
                    >{`${date.getDate()}. ${date.toLocaleString("en-us", {
                      month: "short",
                    })} ${date.getFullYear()} · ${date.getUTCHours()}:${date
                      .getUTCSeconds()
                      .toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}`}</div>
                  ) : null}

                  <div className={"type"}>
                    <svg
                      className={
                        event.data.type === "regular"
                          ? "--green"
                          : event.data.type === "warning"
                          ? "--yellow"
                          : "--red"
                      }
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className={"fill"}
                        cx="6"
                        cy="6"
                        r="6"
                        fill="#11BD37"
                      />
                    </svg>
                    {event.data.type}
                  </div>
                </li>
              );
            })
        ) : (
          <div className={"lds-con"}>
            <div className="lds-ring">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};
