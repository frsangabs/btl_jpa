import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Bandas() {
  const [bandas, setBandas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("http://localhost:8080/bands")
      .then(data => {
        setBandas(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar bandas:", err));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Bandas</h1>
      <ul>
        {bandas.map(b => (
          <li key={b.id}>
            <Link to={`/bands/${b.id}`}>{b.nome}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
