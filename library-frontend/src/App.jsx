import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations"; // 👈 Kept this perfect import

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(() =>
    localStorage.getItem("library-user-token"),
  );
  const client = useApolloClient();

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

        {/* Show add book, recommend, and logout buttons ONLY if logged in */}
        {token ? (
          <>
            <button
              style={{ marginRight: "10px", padding: "5px 10px" }}
              onClick={() => setPage("add")}
            >
              add book
            </button>
            {/* 🔑 Moved the recommend button inside the logged-in check */}
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
      {/* Views */}
      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />

      {/* Guest Views */}
      {!token && (
        <LoginForm
          show={page === "login"}
          setToken={setToken}
          setPage={setPage}
        />
      )}

      {/* strictly authenticated protected views */}
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
