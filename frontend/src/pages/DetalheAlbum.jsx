import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetalheAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/albuns/${id}`)
      .then(res => res.json())
      .then(data => {
        setAlbum(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar detalhes:", err));
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!album) return <p>Álbum não encontrado.</p>;

  return (
    <div>
      <h1>{album.nome}</h1>

      <p><strong>Banda:</strong> {album.bandaNome}</p>
      <p><strong>Ano de lançamento:</strong> {album.ano_lancamento}</p>
      <p><strong>Descrição:</strong> {album.lore}</p>

      {/* MÚSICAS */}
      {album.musicas?.length > 0 && (
        <>
          <h2>Músicas</h2>
          <ul>
            {album.musicas.map(m => (
              <li key={m.id}>
                <Link to={`/musicas/${m.id}`}>
                  {m.nome}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* COMENTÁRIOS */}
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
