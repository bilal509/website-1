import gql from "graphql-tag";
import cookies from "js-cookie";

import { Device } from "api/schema";
import { client } from "api/apollo";
import { Container } from "unstated";

export class DevicesStore extends Container<{ env: Device[] | null }> {
  constructor() {
    super();

    this.state = { env: null };
  }

  private _setDevices = (devices: Device[]) => {
    this.setState({ env: devices });
  };

  public queryDevices = () => {
    return client
      .query<{ devices: Device[] }>({
        query: gql`
          query {
            devices {
              mac
              type
              name
              description
            }
          }
        `,
      })
      .then(({ data }) => {
        this._setDevices(data.devices);
      });
  };
}
