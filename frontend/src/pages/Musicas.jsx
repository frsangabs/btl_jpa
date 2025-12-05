import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import styles from "./Musicas.module.css";

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======= MODAL =======
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newLore, setNewLore] = useState("");
  const [newBandaNome, setNewBandaNome] = useState("");
  const [newAlbumNome, setNewAlbumNome] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const listaMusicas = await api("http://localhost:8080/musicas");
        const favs = await api("http://localhost:8080/favoritos");

        const favMusicas = favs.musicas?.map(m => m.id) || [];

        setMusicas(listaMusicas);
        setFavoritas(favMusicas);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    carregar();
  }, []);

  const salvarNovaMusica = async () => {
    if (!newNome.trim() || !newBandaNome.trim()) return;

    try {
      await api("http://localhost:8080/musicas", {
        method: "POST",
        body: JSON.stringify({
          nome: newNome,
          lore: newLore || null,
          bandaNome: newBandaNome,
          albumNome: newAlbumNome || null,
        }),
      });

      const listaAtualizada = await api("http://localhost:8080/musicas");
      setMusicas(listaAtualizada);

      setShowAddModal(false);
      setNewNome("");
      setNewLore("");
      setNewBandaNome("");
      setNewAlbumNome("");
    } catch (err) {
      console.error("Erro ao criar música:", err);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Músicas</h1>

        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          ➕ Inserir Música
        </button>
      </div>

      <ul className={styles.lista}>
        {musicas.map(m => {
          const isFav = favoritas.includes(m.id);

          return (
            <li key={m.id} className={styles.faixaItem}>
              <div className={styles.faixaContent}>
                <Link to={`/musicas/${m.id}`} className={styles.musicaLink}>
                  {m.nome}
                </Link>

                <span className={styles.separador}>—</span>

                <Link to={`/bands/${m.bandaID}`} className={styles.bandaLink}>
                  {m.bandaNome}
                </Link>
              </div>

              <span className={styles.favorito}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </li>
          );
        })}
      </ul>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitulo}>Adicionar Música</h2>

            <input
              type="text"
              className={styles.modalInput}
              placeholder="Nome da música"
              value={newNome}
              onChange={e => setNewNome(e.target.value)}
            />

            <textarea
              className={styles.modalTextarea}
              placeholder="Lore (opcional)"
              value={newLore}
              onChange={e => setNewLore(e.target.value)}
            />

            <input
              type="text"
              className={styles.modalInput}
              placeholder="Nome da banda"
              value={newBandaNome}
              onChange={e => setNewBandaNome(e.target.value)}
            />

            <input
              type="text"
              className={styles.modalInput}
              placeholder="Nome do álbum (opcional)"
              value={newAlbumNome}
              onChange={e => setNewAlbumNome(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalBtn} ${styles.salvar}`}
                onClick={salvarNovaMusica}
              >
                Salvar
              </button>

              <button
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => setShowAddModal(false)}
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
