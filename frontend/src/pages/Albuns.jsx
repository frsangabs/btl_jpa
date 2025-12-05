import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useSpotifyImage from "../hooks/useSpotifyImage";
import styles from "./Albuns.module.css";

function AlbumCard({ album, isFav }) {
  const image = useSpotifyImage("album", album.nome);

  return (
    <Link to={`/albuns/${album.id}`} className={styles.albumCard}>
      <span className={styles.favHeart}>{isFav ? "❤️" : "🤍"}</span>

      <img
        src={image || "/placeholder.jpg"}
        alt={album.nome}
        className={styles.albumImg}
      />

      <h3 className={styles.albumTitle}>{album.nome}</h3>
      <p className={styles.albumBand}>{album.bandaNome}</p>
    </Link>
  );
}

export default function Albuns() {
  const [albuns, setAlbuns] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [albumNome, setAlbumNome] = useState("");
  const [albumLore, setAlbumLore] = useState("");
  const [albumAno, setAlbumAno] = useState("");
  const [albumBandaId, setAlbumBandaId] = useState("");

  const [bandas, setBandas] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const listaAlbuns = await api("http://localhost:8080/albuns");
        const favs = await api("http://localhost:8080/favoritos");
        const listaBandas = await api("http://localhost:8080/bands");

        setBandas(listaBandas);

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

  const criarAlbum = async () => {
    if (!albumNome.trim() || !albumBandaId) return alert("Nome e Banda são obrigatórios!");

    try {
      const novo = await api("http://localhost:8080/albuns", {
        method: "POST",
        body: JSON.stringify({
          nome: albumNome,
          lore: albumLore || null,
          ano_lancamento: albumAno ? Number(albumAno) : 0,
          bandaId: Number(albumBandaId),
        }),
      });

      setAlbuns(prev => [...prev, novo]);
      setAlbumNome("");
      setAlbumLore("");
      setAlbumAno("");
      setAlbumBandaId("");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar álbum:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.albunsContainer}>

      {/* HEADER */}
      <div className={styles.albunsHeader}>
        <h1>Álbuns</h1>

        <button className={styles.btnAdd} onClick={() => setShowModal(true)}>
          + Adicionar Álbum
        </button>
      </div>

      {/* GRID */}
      <div className={styles.albunsGrid}>
        {albuns.map(album => (
          <AlbumCard
            key={album.id}
            album={album}
            isFav={favoritas.includes(album.id)}
          />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Novo Álbum</h2>

            <input
              className={styles.modalInput}
              value={albumNome}
              onChange={e => setAlbumNome(e.target.value)}
              placeholder="Nome do álbum (obrigatório)"
            />

            <textarea
              className={styles.modalTextarea}
              value={albumLore}
              onChange={e => setAlbumLore(e.target.value)}
              placeholder="Lore (opcional)"
            />

            <input
              className={styles.modalInput}
              type="number"
              value={albumAno}
              onChange={e => setAlbumAno(e.target.value)}
              placeholder="Ano de lançamento (opcional)"
            />

            <select
              className={styles.modalSelect}
              value={albumBandaId}
              onChange={e => setAlbumBandaId(e.target.value)}
            >
              <option value="">Selecione a banda...</option>
              {bandas.map(b => (
                <option key={b.id} value={b.id}>{b.nome}</option>
              ))}
            </select>

            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={criarAlbum}>
                Salvar
              </button>
              <button
                className={`${styles.modalBtn} ${styles.cancel}`}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
