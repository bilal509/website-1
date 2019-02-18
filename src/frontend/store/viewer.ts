import gql from "graphql-tag";
import cookies from "js-cookie";
import { Container } from "unstated";

import { User, LoginMutationArgs } from "api/schema";
import { client } from "api/apollo";
import { inputParser } from "modules/input-parser";
import { browserHistory } from "enviroment/history";

export class ViewerStore extends Container<{
  env: User | null;
  isAuthorized: boolean;
  isLoggedIn: boolean;
}> {
  constructor() {
    super();

    this.state = {
      env: null,
      isLoggedIn: cookies.get("session") ? true : false,
      isAuthorized: cookies.get("auth") === "true",
    };
  }

  public login = (args: LoginMutationArgs) => {
    if (args.input!.username === "enduser") {
      cookies.set("session", "true");
      this.setState({
        ...this.state.env,
        isAuthorized: false,
        isLoggedIn: true,
      });
    }

    if (args.input!.username === "supervisor") {
      cookies.set("session", "true");
      cookies.set("auth", "true");

      this.setState({
        isAuthorized: true,
        isLoggedIn: true,
      });
    }

    return client
      .mutate<{ cookie: string }>({
        mutation: gql`
          mutation {
            cookie: login(${inputParser(args)})
          }
        `,
      })
      .then(({ data }) => {
        this.setState({ isLoggedIn: true });

        return this.queryViewer();
      });
  };

  public logout = () => {
    cookies.remove("session");
    cookies.remove("auth");

    this.setState({
      isLoggedIn: false,
      isAuthorized: false,
    });
  };

  public queryViewer = () => {
    return client
      .query<{ viewer: User }>({
        query: gql`
          query {
            viewer {
              id

              email
              firstname
              lastname
              username
            }
          }
        `,
      })
      .then(({ data }) => {
        this.setState({ env: data.viewer });
      });
  };
}
