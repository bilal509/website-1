import "./loginPage.scss";

import { useState, useEffect } from "react";

import { ViewerStore } from "store/viewer";
import { Input } from "components/common/input/input";
import { Button } from "components/common/button/button";
import { browserHistory } from "enviroment/history";
import { DevicesStore } from "store/devices";
import { User } from "api/schema";

type Props = {
  viewer: ViewerStore;
  devices: DevicesStore;
};

export const LoginPage = ({ viewer, devices }: Props) => {
  useEffect(() => {
    if (viewer.state.env) {
      browserHistory.replace("/user");
    } else if (viewer.state.isLoggedIn) {
      viewer.queryViewer();
    }
  });

  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });

  return (
    <div className={"loginPage"}>
      <div className={"head"}>
        <span>{"Welcome back"}</span>
        <span>{"Login to manage your organisation"}</span>
      </div>
      <form
        className={"form"}
        onSubmit={event => {
          event.preventDefault();
          viewer.login({
            input: {
              username,
              password,
            },
          });
        }}
      >
        <div className={"form__row"}>
          <label htmlFor={"name"}>{"Name"}</label>
          <Input
            name={"name"}
            value={username}
            onChange={event =>
              setForm({
                username: event.target.value,
                password,
              })
            }
          />
        </div>
        <div className={"form__row"}>
          <label htmlFor={"password"}>{"Password"}</label>
          <Input
            name={"password"}
            value={password}
            type={"password"}
            onChange={event =>
              setForm({
                password: event.target.value,
                username,
              })
            }
          />
        </div>
        <Button
          deactivated={username.length === 0 || password.length === 0}
          primary
        >
          {"Login to HyperPrivacy"}
        </Button>
      </form>
    </div>
  );
};
