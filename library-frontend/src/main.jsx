import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1. Core client capabilities stay here
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// 2. React-specific components (like ApolloProvider) must be imported from the /react sub-path
import { ApolloProvider } from "@apollo/client/react";

// Establish the network link to your backend server running on port 4000
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
  cache: new InMemoryCache(),
});

// Wrap the root container inside the ApolloProvider context
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
