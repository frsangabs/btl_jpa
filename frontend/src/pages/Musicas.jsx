import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const listaMusicas = await api("http://localhost:8080/musicas");
        const favs = await api("http://localhost:8080/favoritos");

        const favMusicas = favs.musicas?.map(m => m.id) || [];

        setMusicas(listaMusicas);
        setFavoritas(favMusicas);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    carregar();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Músicas</h1>

      <ul>
        {musicas.map(m => {
          const isFav = favoritas.includes(m.id);

          return (
            <li key={m.id}>
              <Link to={`/musicas/${m.id}`}>{m.nome}</Link>{" "}
              —{" "}
              <Link to={`/bands/${m.bandaID}`}>{m.bandaNome}</Link>{" "}
              <span style={{ fontSize: 20 }}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
