import { useState } from "react";
// 🌟 Import the mutation hook and the query strings
import { useMutation } from "@apollo/client/react";
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  // 🌟 Explicitly refetch both the base query and the explicit { genre: null } query variation
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS }, // Refetches base query used for updating stable genre buttons
      { query: ALL_BOOKS, variables: { genre: null } }, // Refetches the "all genres" table query layout
      { query: ALL_AUTHORS }, // Refetches authors list
    ],
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    // 🌟 Execute the mutation, safely parsing the published year string to an Int
    addBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres,
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          {/* 🌟 Input nested inside label so Playwright can find it by its text label */}
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          {/* 🌟 Input nested inside label */}
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          {/* 🌟 Input nested inside label */}
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button
            onClick={addGenre}
            type="button"
            style={{ marginLeft: "10px" }}
          >
            add genre
          </button>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          genres: {genres.join(" ")}
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
