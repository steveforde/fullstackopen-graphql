import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  // 1. Fetch the book data from your backend server
  const result = useQuery(ALL_BOOKS);

  // 2. Return early if this page view isn't active
  if (!props.show) {
    return null;
  }

  // 3. Show a loading state while the network request is on the wire
  if (result.loading) {
    return <div>loading books...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th> <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>{" "}
              {/* 🌟 FIXED: Accessing .name since author is now an object */}
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
