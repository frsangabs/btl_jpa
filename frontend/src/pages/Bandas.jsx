import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useSpotifyImage from "../hooks/useSpotifyImage";
import styles from "./Bandas.module.css";

function BandaCard({ banda, isFav }) {
  const image = useSpotifyImage("artist", banda.nome);

  return (
    <Link to={`/bands/${banda.id}`} className={styles.bandaCard}>
      <span className={styles.favHeart}>{isFav ? "❤️" : "🤍"}</span>
      <img
        src={image || "/placeholder.jpg"}
        alt={banda.nome}
        className={styles.bandaImg}
      />
      <h3 className={styles.bandaTitle}>{banda.nome}</h3>
    </Link>
  );
}

export default function Bandas() {
  const [bandas, setBandas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [novaBandaNome, setNovaBandaNome] = useState("");
  const [novaBandaLore, setNovaBandaLore] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const listaBandas = await api("http://localhost:8080/bands");
        const favs = await api("http://localhost:8080/favoritos");
        const favBandas = favs.bandas?.map((b) => b.id) || [];

        setBandas(listaBandas);
        setFavoritas(favBandas);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregar();
  }, []);

  const criarBanda = async () => {
    if (!novaBandaNome.trim()) return;

    try {
      const nova = await api("http://localhost:8080/bands", {
        method: "POST",
        body: JSON.stringify({
          nome: novaBandaNome,
          lore: novaBandaLore || null,
        }),
      });

      setBandas((prev) => [...prev, nova]);
      setNovaBandaNome("");
      setNovaBandaLore("");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar banda:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.bandasContainer}>

      {/* HEADER */}
      <div className={styles.bandasHeader}>
        <h1>Bandas</h1>
        <button className={styles.btnAdd} onClick={() => setShowModal(true)}>
          + Adicionar Banda
        </button>
      </div>

      {/* GRID */}
      <div className={styles.bandasGrid}>
        {bandas.map((b) => (
          <BandaCard key={b.id} banda={b} isFav={favoritas.includes(b.id)} />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Nova Banda</h2>

            <input
              value={novaBandaNome}
              onChange={(e) => setNovaBandaNome(e.target.value)}
              placeholder="Nome da banda"
              className={styles.modalInput}
            />

            <textarea
              value={novaBandaLore}
              onChange={(e) => setNovaBandaLore(e.target.value)}
              placeholder="Lore (opcional)"
              className={styles.modalTextarea}
            />

            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={criarBanda}>
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
