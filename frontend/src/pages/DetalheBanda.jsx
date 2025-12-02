import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function DetalheBanda() {
  const { id } = useParams();
  const [banda, setBanda] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`http://localhost:8080/bands/${id}`)
      .then(data => {
        setBanda(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar detalhes:", err));
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!banda) return <p>Banda não encontrada.</p>;

  return (
    <div>
      <h1>{banda.nome}</h1>
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
