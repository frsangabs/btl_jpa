import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheBanda() {
  const { id } = useParams();
  const [banda, setBanda] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

    // Carrega detalhes + verifica se é favorita
  useEffect(() => {
    verificarFavorito();
  }, [id]);

  useEffect(() => {
    api(`http://localhost:8080/bands/${id}`)
      .then(data => {
        setBanda(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar detalhes:", err));
  }, [id]);


  // ⭐ 2) Verifica se banda já está nos favoritos do usuário
  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");

      // Backend deve retornar algo como: { bandas: [...], albuns: [...], musicas: [...] }
      const jaFav = favs.bandas?.some(b => b.id === Number(id));

      setIsFav(!!jaFav);
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  }

  // ⭐ 3) Função de alternância de favorito
  async function toggleFavorito() {
    try {
      if (isFav) {
        await desfavoritar("bands", id);
        setIsFav(false);
      } else {
        await favoritar("bands", id);
        setIsFav(true);
      }
    } catch (err) {
      console.error("Erro ao favoritar/desfavoritar:", err);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!banda) return <p>Banda não encontrada.</p>;

  return (
    <div>
      <h1>{banda.nome}</h1>

      <button
          onClick={toggleFavorito}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 32,
            marginLeft: 10
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>


      <p><strong>Descrição:</strong> {banda.lore}</p>

      {banda.albuns?.length > 0 && (
        <>
          <h2>Álbuns</h2>
          <ul>
            {banda.albuns.map(a => (
              <li key={a.id}>
                <Link to={`/albuns/${a.id}`}>{a.nome} </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {banda.musicas?.length > 0 && (
        <>
          <h2>Músicas</h2>
          <ul>
            {banda.musicas.map(m => (
              <li key={m.id}>
                <Link to={`/musicas/${m.id}`}> {m.nome} </Link>
                </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
