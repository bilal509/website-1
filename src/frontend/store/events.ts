import gql from "graphql-tag";
import cookies from "js-cookie";
import { Event } from "api/schema";
import { client } from "api/apollo";
import { Container } from "unstated";

export class EventsStore extends Container<{
  env: Event[] | null;
}> {
  constructor() {
    super();

    this.state = { env: null };

    this.init();

    setInterval(() => {
      this.init();
    }, 3000);
  }

  public init = () => {
    client
      .query<{ events: Event[] }>({
        query: gql`
          query {
            events {
              device {
                mac
              }

              data
            }
          }
        `,
      })
      .then(({ data }) => {
        if (data.events) {
          this.setState({
            env: data.events
              .map((event: any) => {
                const data = JSON.parse(event.data);

                return {
                  ...event,
                  data: typeof data === "string" ? JSON.parse(data) : data,
                };
              })
              .filter((event: any) => {
                return "creation" in event.data;
              }),
          });
        }
      });
  };
}
