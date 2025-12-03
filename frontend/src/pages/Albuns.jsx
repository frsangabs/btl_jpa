import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Albuns() {
  const [albuns, setAlbuns] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const listaAlbuns = await api("http://localhost:8080/albuns");
        const favs = await api("http://localhost:8080/favoritos");

        const favAlbuns = favs.albuns?.map(a => a.id) || [];

        setAlbuns(listaAlbuns);
        setFavoritas(favAlbuns);
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
      <h1>Álbuns</h1>

      <ul>
        {albuns.map(a => {
          const isFav = favoritas.includes(a.id);

          return (
            <li key={a.id}>
              <Link to={`/albuns/${a.id}`}>{a.nome}</Link>{" "}
              — <Link to={`/bands/${a.bandaId}`}>{a.bandaNome}</Link>{" "}
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
