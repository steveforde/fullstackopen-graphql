import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { gql } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

import { ALL_BOOKS } from "./queries";

// 1. Subscription query matching core entity parameters
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
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  // 2. Clear, corrected subscription refetch engine
  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const addedBook = data.data.bookAdded;
      notify(
        `New book added: "${addedBook.title}" by ${addedBook.author.name}`,
      );

      client.refetchQueries({
        include: [
          { query: ALL_BOOKS },
          { query: ALL_BOOKS, variables: { genre: null } },
        ],
      });
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
    setPage("authors");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      {/* Navigation Menu */}
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

      {/* Fixed styling syntax error bracket here */}
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
