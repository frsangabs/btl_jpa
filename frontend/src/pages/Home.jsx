import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import styles from "./Home.module.css"; 
import useSpotifyImage from "../hooks/useSpotifyImage";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("http://localhost:8080/home")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error("Erro ao carregar home:", err));
  }, []);

  const bandImg = useSpotifyImage("artist", data?.topBand?.nome);
  const albumImg = useSpotifyImage("album", data?.topAlbum?.nome);
  const musicImg = useSpotifyImage("track", data?.topMusic?.nome);

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Erro ao carregar dados.</p>;

  return (
    <div className={styles.container}>
      
      <h1 className={styles.sectionTitle}>Mais quentes do momento</h1>

      <div className={styles.hotCards}>
        
        {data.topBand && (
          <Link to={`/bands/${data.topBand.id}`} className={styles.card}>
            <div
              className={styles.cardImage}
              style={{ backgroundImage: `url(${bandImg})` }}
            ></div>
            <p className={styles.cardTitle}>{data.topBand.nome}</p>
            <span className={styles.cardTag}>Banda</span>
          </Link>
        )}

        {data.topAlbum && (
          <Link to={`/albuns/${data.topAlbum.id}`} className={styles.card}>
            <div
              className={styles.cardImage}
              style={{ backgroundImage: `url(${albumImg})` }}
            ></div>
            <p className={styles.cardTitle}>{data.topAlbum.nome}</p>
            <span className={styles.cardTag}>Álbum</span>
          </Link>
        )}

        {data.topMusic && (
          <Link to={`/musicas/${data.topMusic.id}`} className={styles.card}>
            <div
              className={styles.cardImage}
              style={{ backgroundImage: `url(${musicImg})` }}
            ></div>
            <p className={styles.cardTitle}>{data.topMusic.nome}</p>
            <span className={styles.cardTag}>Música</span>
          </Link>
        )}
      </div>

      <h2 className={styles.sectionTitle}>Últimas tracks adicionadas</h2>

      <ul className={styles.lastSongsList}>
        {data.latestSongs?.length > 0 ? (
          data.latestSongs.slice(0, 10).map((m) => (
            <Link to={`/musicas/${m.id}`} className={styles.songLink}>
              <li key={m.id} className={styles.songItem}>
                {m.nome}
                <span className={styles.songBand}>{m.banda?.nome}</span>
                <span className={styles.songArrow}>➜</span>
              </li>
            </Link>
          ))
        ) : (
          <p>Nenhuma música encontrada.</p>
        )}
      </ul>
    </div>
  );
}
