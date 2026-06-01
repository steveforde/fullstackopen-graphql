import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message || error.message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
    }
  }, [result.data]); // eslint-disable-line

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <form onSubmit={submit}>
        <div style={{ marginBottom: "10px" }}>
          name{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" style={{ padding: "5px 10px" }}>
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
