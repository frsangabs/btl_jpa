import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarFavorito();
  }, [id]);

  useEffect(() => {
    api(`http://localhost:8080/albuns/${id}`)
      .then(data => {
        setAlbum(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, [id]);

  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");

      const jaFav = favs.albuns?.some(a => a.id === Number(id));
      setIsFav(!!jaFav);
    } catch (err) {
      console.error("Erro verificar favorito:", err);
    }
  }

  async function toggleFavorito() {
    try {
      if (isFav) {
        await desfavoritar("albuns", id);
        setIsFav(false);
      } else {
        await favoritar("albuns", id);
        setIsFav(true);
      }
    } catch (err) {
      console.error("Erro toggle favorito:", err);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!album) return <p>Álbum não encontrado.</p>;

  return (
    <div>
      <h1>{album.nome}</h1>

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

      <p>
        <strong>Banda:</strong>{" "}
        <Link to={`/bands/${album.bandaId}`}>
          {album.bandaNome}
        </Link>
      </p>
      <p><strong>Ano de lançamento:</strong> {album.ano_lancamento}</p>
      <p><strong>Descrição:</strong> {album.lore}</p>

      {album.musicas?.length > 0 && (
        <>
          <h2>Músicas</h2>
          <ul>
            {album.musicas.map(m => (
              <li key={m.id}>
                <Link to={`/musicas/${m.id}`}>{m.nome}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {album.comentarios?.length > 0 && (
        <>
          <h2>Comentários</h2>
          <ul>
            {album.comentarios.map((c, index) => (
              <li key={index}>
                <strong>{c.usuario}</strong>: {c.texto}
                <br />
                <small>{new Date(c.data).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
