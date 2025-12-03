import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Bandas() {
  const [bandas, setBandas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        // 1) Carrega bandas
        const listaBandas = await api("http://localhost:8080/bands");

        // 2) Carrega favoritos do usuário
        const favs = await api("http://localhost:8080/favoritos");

        // Assume que o backend retorna { bandas: [...] }
        const favBandas = favs.bandas?.map(b => b.id) || [];

        setBandas(listaBandas);
        setFavoritas(favBandas);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregar();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Bandas</h1>
      <ul>
        {bandas.map(b => {
          const isFav = favoritas.includes(b.id);

          return (
            <li key={b.id}>
              <Link to={`/bands/${b.id}`}>{b.nome}</Link>{" "}
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
