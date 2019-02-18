export const graphqlHttpEndpointUrl = process.env
  .GRAPHQL_HTTP_ENDPOINT_URL as string;

export const graphqlWsEndpointUrl = process.env
  .GRAPHQL_WS_ENDPOINT_URL as string;

const extauthUrlPrefix = process.env.EXTAUTH_PREFIX_URL as string;
export const getExtauthUrl = (
  provider: string,
  operation: "login" | "register",
) => {
  return `${extauthUrlPrefix}/${provider}/${operation}`;
};

export const getAbsoluteCollectionUrl = (id: string) => {
  return `${window.origin}/collection/${id}`;
};

export const getCollectionUrl = (id: string) => {
  return `/collection/${id}`;
};

export const getProfileUrl = (id: string = "me") => {
  return `/user/${id}`;
};
