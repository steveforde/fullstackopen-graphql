import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("all genres");
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading books...</div>;
  }

  const books = result.data.allBooks;

  // 1. Extract all unique genres across all books dynamically
  const allGenresSet = new Set();
  books.forEach((b) => {
    if (b.genres) {
      b.genres.forEach((g) => allGenresSet.add(g));
    }
  });
  const uniqueGenres = Array.from(allGenresSet);

  // 2. Filter the book list based on the selected genre state
  const booksToShow =
    genreFilter === "all genres"
      ? books
      : books.filter((b) => b.genres.includes(genreFilter));

  return (
    <div>
      <h2>books</h2>

      {genreFilter !== "all genres" && (
        <p style={{ margin: "10px 0" }}>
          in genre <strong>{genreFilter}</strong>
        </p>
      )}

      <table style={{ marginBottom: "20px" }}>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 3. Render the genre buttons at the bottom */}
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {uniqueGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genre)}
            style={{ fontWeight: genreFilter === genre ? "bold" : "normal" }}
          >
            {genre}
          </button>
        ))}
        <button
          onClick={() => setGenreFilter("all genres")}
          style={{
            fontWeight: genreFilter === "all genres" ? "bold" : "normal",
          }}
        >
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
