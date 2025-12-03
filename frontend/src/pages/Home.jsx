import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("http://localhost:8080/home")
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao carregar home:", err));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Erro ao carregar dados.</p>;

  return (
    <div>
      <h1>🏠 Página Inicial</h1>

      <section>
        <h2>Mais Favoritados</h2>

        {/* Banda */}
        {data.topBand && (
          <p>
            <strong>Banda mais favoritada:</strong>{" "}
            <Link to={`/bands/${data.topBand.id}`}>
              {data.topBand.nome}
            </Link>
          </p>
        )}

        {/* Álbum */}
        {data.topAlbum && (
          <p>
            <strong>Álbum mais favoritado:</strong>{" "}
            <Link to={`/albuns/${data.topAlbum.id}`}>
              {data.topAlbum.nome}
            </Link>
          </p>
        )}

        {/* Música */}
        {data.topMusic && (
          <p>
            <strong>Música mais favoritada:</strong>{" "}
            <Link to={`/musicas/${data.topMusic.id}`}>
              {data.topMusic.nome}
            </Link>
          </p>
        )}
      </section>

      <hr />

      <section>
        <h2>🎵 Últimas músicas adicionadas</h2>

        {data.latestSongs?.length > 0 ? (
          <ul>
            {data.latestSongs.map(m => (
              <li key={m.id}>
                <Link to={`/musicas/${m.id}`}>{m.nome}</Link> {" "}
                <i>{m.banda?.nome}</i>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma música encontrada.</p>
        )}
      </section>
    </div>
  );
}
