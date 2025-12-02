import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function DetalheMusica() {
  const { id } = useParams();
  const [musica, setMusica] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`http://localhost:8080/musicas/${id}`)
      .then(data => {
        setMusica(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar música:", err));
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!musica) return <p>Música não encontrada.</p>;

  return (
    <div>
      <h1>{musica.nome}</h1>
      <p><strong>Descrição:</strong> {musica.lore}</p>

      {/* 🔗 Link para banda */}
      <p>
        <strong>Banda:</strong>{" "}
        <Link to={`/bands/${musica.bandaID}`}>
          {musica.bandaNome}
        </Link>
      </p>

      {/* 🔗 Link para álbum */}
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
