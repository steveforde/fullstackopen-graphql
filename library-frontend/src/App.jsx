import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(() =>
    localStorage.getItem("library-user-token"),
  );
  // 🌟 State to hold the login failure message for Playwright
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  // 🌟 Helper function to temporarily show and then auto-clear the message
  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

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

      {/* 🌟 Visual Notification Banner for Playwright to look for */}
      {errorMessage && (
        <div style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>
          {errorMessage}
        </div>
      )}

      {/* Views */}
      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />

      {/* Guest Views */}
      {!token && (
        <LoginForm
          show={page === "login"}
          setToken={setToken}
          setPage={setPage}
          notify={notify} // 👈 🌟 Passing notify function as a prop here
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
