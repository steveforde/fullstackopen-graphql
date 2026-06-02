import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// 1. Authentication link for standard HTTP traffic
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// 2. HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

// 3. WebSocket link for real-time subscriptions (matching backend root path '/')
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/",
  }),
);

// 4. Using split to route traffic: Subscriptions use wsLink, everything else uses authLink + httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

// 5. Connect ApolloClient to our smart routing link configuration
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
