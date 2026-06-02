import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("all genres");

  const allBooksResult = useQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
  });

  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter === "all genres" ? null : genreFilter },
    fetchPolicy: "network-only",
  });

  if (!props.show) {
    return null;
  }

  if (allBooksResult.loading || filteredBooksResult.loading) {
    return <div>loading books...</div>;
  }

  const booksForButtons = allBooksResult.data.allBooks;
  const allGenresSet = new Set();
  booksForButtons.forEach((b) => {
    if (b.genres) {
      b.genres.forEach((g) => allGenresSet.add(g));
    }
  });
  const uniqueGenres = Array.from(allGenresSet);

  const booksToShow = filteredBooksResult.data.allBooks;

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
