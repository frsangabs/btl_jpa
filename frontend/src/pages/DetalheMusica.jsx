import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheMusica() {
  const { id } = useParams();
  const [musica, setMusica] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarFavorito();
  }, [id]);

  useEffect(() => {
    api(`http://localhost:8080/musicas/${id}`)
      .then(data => {
        setMusica(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, [id]);

  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");

      const jaFav = favs.musicas?.some(m => m.id === Number(id));
      setIsFav(!!jaFav);
    } catch (err) {
      console.error("Erro verificar favorito:", err);
    }
  }

  async function toggleFavorito() {
    try {
      if (isFav) {
        await desfavoritar("musicas", id);
        setIsFav(false);
      } else {
        await favoritar("musicas", id);
        setIsFav(true);
      }
    } catch (err) {
      console.error("Erro toggle favorito:", err);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!musica) return <p>Música não encontrada.</p>;

  return (
    <div>
      <h1>
        {musica.nome}
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
      </h1>

      <p><strong>Descrição:</strong> {musica.lore}</p>

      <p>
        <strong>Banda:</strong>{" "}
        <Link to={`/bands/${musica.bandaID}`}>
          {musica.bandaNome}
        </Link>
      </p>

      <p>
        <strong>Álbum:</strong>{" "}
        <Link to={`/albuns/${musica.almbumID}`}>
          {musica.albumNome}
        </Link>
      </p>

      <hr />

      <h2>Comentários</h2>

      {musica.comentarios?.length > 0 ? (
        <ul>
          {musica.comentarios.map((c, index) => (
            <li key={index}>
              <strong>{c.usuario}</strong>: {c.texto}
              <br />
              <small>{new Date(c.data).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum comentário.</p>
      )}

      <br />
      <Link to="/musicas">Voltar</Link>
    </div>
  );
}
