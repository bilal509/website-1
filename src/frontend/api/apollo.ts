import { ApolloClient, ApolloQueryResult } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, DocumentNode, FetchResult } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";

import { graphqlWsEndpointUrl, graphqlHttpEndpointUrl } from "enviroment/urls";
import { browserSupportsWebsockets } from "enviroment/features";
import { GraphQLError } from "graphql";

const link = (() => {
  if (browserSupportsWebsockets) {
    return new WebSocketLink({
      uri: graphqlWsEndpointUrl,
      options: {
        reconnect: true,
      },
    });
  } else {
    return new HttpLink({
      uri: graphqlHttpEndpointUrl,
      credentials: "include",
    });
  }
})();

export const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    link,
  ]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
  cache: new InMemoryCache(),
});
