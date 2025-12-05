import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";
import useSpotifyImage from "../hooks/useSpotifyImage";
import styles from "./DetalheAlbum.module.css";

export default function DetalheAlbum() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  const [bandas, setBandas] = useState([]);

  // EDIÇÃO
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");
  const [editAno, setEditAno] = useState("");
  const [editBandaId, setEditBandaId] = useState("");

  // COMENTÁRIO
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  // CAPA DO ALBUM (Spotify)
  const albumImg = useSpotifyImage("album", album?.nome);

  useEffect(() => {
    api("http://localhost:8080/bands")
      .then(setBandas)
      .catch((err) => console.error("Erro ao carregar bandas:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api(`http://localhost:8080/albuns/${id}`)
      .then((data) => {
        setAlbum(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    verificarFavorito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");
      const jaFav = favs.albuns?.some((a) => a.id === Number(id));
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

  // EDIÇÃO
  const abrirModalEdicao = () => {
    setEditNome(album.nome);
    setEditLore(album.lore || "");
    setEditAno(album.ano_lancamento || "");
    setEditBandaId(album.bandaId || "");
    setShowEditModal(true);
  };

  const salvarEdicao = async () => {
    if (!editNome.trim()) return;
    try {
      await api(`http://localhost:8080/albuns/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: editNome,
          lore: editLore || null,
          ano_lancamento: Number(editAno),
          bandaId: Number(editBandaId),
        }),
      });

      const atualizado = await api(`http://localhost:8080/albuns/${id}`);
      setAlbum(atualizado);
      setShowEditModal(false);
    } catch (err) {
      console.error("Erro ao atualizar álbum:", err);
    }
  };

  // DELETE
  const deletarAlbum = async () => {
    if (!window.confirm("Deseja realmente excluir este álbum?")) return;
    try {
      await api(`http://localhost:8080/albuns/${id}`, { method: "DELETE" });
      navigate("/albuns");
    } catch (err) {
      console.error("Erro ao deletar álbum:", err);
    }
  };

  // COMENTÁRIO
  const abrirModalComentario = () => {
    setNovoComentario("");
    setShowCommentModal(true);
  };

  const salvarComentario = async () => {
    if (!novoComentario.trim()) return;
    try {
      await api(`http://localhost:8080/comments/albuns/${id}`, {
        method: "POST",
        body: JSON.stringify({ texto: novoComentario }),
      });

      const atualizado = await api(`http://localhost:8080/albuns/${id}`);
      setAlbum(atualizado);
      setShowCommentModal(false);
    } catch (err) {
      console.error("Erro ao salvar comentário:", err);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!album) return <p className={styles.loading}>Álbum não encontrado.</p>;

  return (
    <div className={styles.container}>
      {/* TOP: imagem + título + favoritos + ações */}
      <div className={styles.top}>
        <img
          src={albumImg || "/placeholder-album.png"}
          alt={album.nome}
          className={styles.albumCover}
        />

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{album.nome}</h1>

          <div className={styles.metaRow}>
            <Link to={`/bands/${album.bandaId}`} className={styles.bandLink}>
              {album.bandaNome}
            </Link>
            <span className={styles.year}>{album.ano_lancamento || "—"}</span>
          </div>

          <div className={styles.actionsRow}>
            <button
              className={styles.favoriteBtn}
              onClick={toggleFavorito}
              aria-label={isFav ? "Desfavoritar" : "Favoritar"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>

            <button className={styles.editBtn} onClick={abrirModalEdicao}>
              Editar
            </button>

            <button className={styles.deleteBtn} onClick={deletarAlbum}>
              Deletar
            </button>

          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Descrição</h2>
        <div className={styles.cardBox}>
          <p className={styles.descriptionText}>
            {album.lore || "Sem descrição disponível."}
          </p>
        </div>
      </section>

      {/* MÚSICAS */}
      {album.musicas?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Músicas</h2>
          <ul className={styles.trackList}>
            {album.musicas.map((m) => (
              <li key={m.id} className={styles.trackItem}>
                <Link to={`/musicas/${m.id}`} className={styles.trackLink}>
                  {m.nome}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* COMENTÁRIOS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Comentários</h2>
          <button className={styles.addCommentBtn} onClick={abrirModalComentario}>
            + Comentar
          </button>
        </div>

        {album.comentarios?.length > 0 ? (
          <ul className={styles.commentsList}>
            {album.comentarios.map((c, i) => (
              <li key={i} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <strong>{c.usuario || "Anônimo"}</strong>
                  <small className={styles.commentDate}>
                    {new Date(c.data).toLocaleString()}
                  </small>
                </div>
                <p className={styles.commentText}>{c.texto}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noComments}>Seja o primeiro a comentar.</p>
        )}
      </section>

      {/* MODAL DE COMENTÁRIO */}
      {showCommentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Novo Comentário</h3>
            <textarea
              className={styles.modalTextarea}
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={salvarComentario}>
                Enviar
              </button>
              <button
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => setShowCommentModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Editar Álbum</h3>

            <input
              className={styles.modalInput}
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
            />

            <textarea
              className={styles.modalTextarea}
              value={editLore}
              onChange={(e) => setEditLore(e.target.value)}
            />

            <input
              className={styles.modalInput}
              type="number"
              value={editAno}
              onChange={(e) => setEditAno(e.target.value)}
            />

            <select
              className={styles.modalInput}
              value={editBandaId}
              onChange={(e) => setEditBandaId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {bandas.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>

            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={salvarEdicao}>
                Salvar
              </button>
              <button
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => setShowEditModal(false)}
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
