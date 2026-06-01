import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = (props) => {
  const userResult = useQuery(ME, {
    fetchPolicy: "no-cache", // Forces Apollo to get a fresh user state every time
  });

  const favoriteGenre = userResult.data?.me?.favoriteGenre;

  // 🔑 UPDATE: Use the genre variable and cache policy to ensure it's always up-to-date
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Don't run the query until we successfully have the favorite genre
    fetchPolicy: "cache-and-network",
  });

  if (!props.show) {
    return null;
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading recommendations...</div>;
  }

  const user = userResult.data?.me;

  // If no user object is found, return nothing to keep it clean
  if (!user) {
    return null;
  }

  // 🔑 UPDATE: The server already did the filtering, so we can use the data directly
  const recommendedBooks = booksResult.data?.allBooks || [];

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
