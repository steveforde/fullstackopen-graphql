import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState(null);

  // Fetch both datasets using a network policy that updates smoothly
  const allBooksResult = useQuery(ALL_BOOKS);
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  });

  if (!props.show) {
    return null;
  }

  // 🌟 FIX: Check for missing data instead of blocking on the loading flags!
  // This allows stale/cached rows to remain visible during background network updates.
  if (!allBooksResult.data || (genre && !filteredBooksResult.data)) {
    return <div>loading books...</div>;
  }

  // Determine which data pool to loop through
  const books = genre
    ? filteredBooksResult.data.allBooks
    : allBooksResult.data.allBooks;

  // Extract all unique genres across all books for the filter buttons
  const allUniqueGenres = allBooksResult.data.allBooks
    ? [...new Set(allBooksResult.data.allBooks.flatMap((b) => b.genres))]
    : [];

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Genre Filter Control Buttons */}
      <div style={{ marginTop: "20px" }}>
        {allUniqueGenres.map((g) => (
          <button
            key={g}
            style={{ marginRight: "5px", padding: "5px 10px" }}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
        <button style={{ padding: "5px 10px" }} onClick={() => setGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
