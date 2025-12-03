import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await login({ username, password });
      navigate("/", { replace: true }); // redireciona para home
    } catch (error) {
      setErr(error.message || "Erro ao logar");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            placeholder="senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}
