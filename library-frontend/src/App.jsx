import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  const [page, setPage] = useState("authors");

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
        <button style={{ padding: "5px 10px" }} onClick={() => setPage("add")}>
          add book
        </button>
      </div>

      {/* Your views */}
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
