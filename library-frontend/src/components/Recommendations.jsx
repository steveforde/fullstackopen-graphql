import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = (props) => {
  const userResult = useQuery(ME, {
    fetchPolicy: "no-cache", // Forces Apollo to get a fresh user state every time
  });
  const booksResult = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading recommendations...</div>;
  }

  const user = userResult.data?.me;
  const books = booksResult.data?.allBooks || [];

  // If no user object is found, return nothing to keep it clean
  if (!user) {
    return null;
  }

  const favoriteGenre = user.favoriteGenre;

  // 🔑 UPDATED FILTER: Robust case-insensitive comparison for the genres array
  const recommendedBooks = books.filter((b) => {
    if (!b.genres) return false;
    return b.genres.some(
      (g) => g.toLowerCase().trim() === favoriteGenre.toLowerCase().trim(),
    );
  });

  return (
    <div>
      <h2>recommendations</h2>
      <p style={{ margin: "10px 0" }}>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: "left", paddingRight: "15px" }}>title</th>
            <th style={{ textAlign: "left", paddingRight: "15px" }}>author</th>
            <th style={{ textAlign: "left" }}>published</th>
          </tr>
          {recommendedBooks.map((b) => (
            <tr key={b.id || b.title}>
              <td style={{ paddingRight: "15px" }}>{b.title}</td>
              {/* 🔑 SAFELY READ NESTED AUTHOR */}
              <td style={{ paddingRight: "15px" }}>
                {b.author?.name || "Unknown"}
              </td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
