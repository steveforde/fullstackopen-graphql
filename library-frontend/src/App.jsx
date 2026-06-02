import { useState } from "react";
// 🌟 Kept useApolloClient here so both the Subscription AND Logout can use it
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { gql } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

import { ALL_BOOKS } from "./queries";

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      published
      genres
      author {
        name
        id
      }
    }
  }
`;

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(() =>
    localStorage.getItem("library-user-token"),
  );
  const [errorMessage, setErrorMessage] = useState(null);

  // 🌟 Clean, centralized client instance used globally across the component
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      notify(
        `New book added: "${addedBook.title}" by ${addedBook.author.name}`,
      );

      // Write to both cache configurations that Books.jsx switches between
      const queries = [
        { query: ALL_BOOKS },
        { query: ALL_BOOKS, variables: { genre: null } },
      ];

      queries.forEach(({ query, variables }) => {
        try {
          const existing = client.readQuery({ query, variables });
          if (existing) {
            client.writeQuery({
              query,
              variables,
              data: {
                allBooks: existing.allBooks.concat(addedBook),
              },
            });
          }
        } catch (e) {
          // Silent catch for cache misses
        }
      });
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore(); // 🌟 Safely uses the top-level client instance here
    setPage("authors");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <button
          style={{ marginRight: "10px", padding: "5px 10px" }}
          onClick={() => setPage("authors")}
        >
          authors
        </button>
        <button
          style={{ marginRight: "10px", padding: "5px 10px" }}
          onClick={() => setPage("books")}
        >
          books
        </button>

        {token ? (
          <>
            <button
              style={{ marginRight: "10px", padding: "5px 10px" }}
              onClick={() => setPage("add")}
            >
              add book
            </button>
            <button
              style={{ marginRight: "10px", padding: "5px 10px" }}
              onClick={() => setPage("recommend")}
            >
              recommend
            </button>
            <button style={{ padding: "5px 10px" }} onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <button
            style={{ padding: "5px 10px" }}
            onClick={() => setPage("login")}
          >
            login
          </button>
        )}
      </div>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>
          {errorMessage}
        </div>
      )}

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />

      {!token && (
        <LoginForm
          show={page === "login"}
          setToken={setToken}
          setPage={setPage}
          notify={notify}
        />
      )}

      {token && (
        <>
          <NewBook show={page === "add"} />
          <Recommendations show={page === "recommend"} />
        </>
      )}
    </div>
  );
};

export default App;
