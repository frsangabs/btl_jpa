import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";
import useSpotifyImage from "../hooks/useSpotifyImage";
import styles from "./DetalheMusica.module.css";

export default function DetalheMusica() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [musica, setMusica] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  const [bandas, setBandas] = useState([]);
  const [albuns, setAlbuns] = useState([]);

  // EDIÇÃO
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");
  const [editBandaId, setEditBandaId] = useState("");
  const [editAlbumId, setEditAlbumId] = useState("");

  // COMENTÁRIO
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  // SPOTIFY: imagem da banda
  const bandaImage = useSpotifyImage("artist", musica?.bandaNome);

  useEffect(() => {
    carregarMusica();
    carregarFavoritos();
    carregarBandas();
  }, [id]);

  async function carregarMusica() {
    setLoading(true);
    try {
      const data = await api(`http://localhost:8080/musicas/${id}`);
      setMusica(data);
    } catch (err) {
      console.error("Erro ao carregar música:", err);
    } finally {
      setLoading(false);
    }
  }

  async function carregarFavoritos() {
    try {
      const favs = await api("http://localhost:8080/favoritos");
      setIsFav(favs.musicas?.some((m) => m.id === Number(id)) ?? false);
    } catch (err) {
      console.error("Erro verificar favorito:", err);
    }
  }

  async function carregarBandas() {
    try {
      const lista = await api("http://localhost:8080/bands");
      setBandas(lista);
    } catch (err) {
      console.error(err);
    }
  }

  async function carregarAlbunsDaBanda(bandaId) {
    try {
      const lista = await api(`http://localhost:8080/albuns/banda/${bandaId}`);
      setAlbuns(Array.isArray(lista) ? lista : lista ? [lista] : []);
    } catch {
      setAlbuns([]);
    }
  }

  async function toggleFavorito() {
    try {
      if (isFav) await desfavoritar("musicas", id);
      else await favoritar("musicas", id);
      setIsFav(!isFav);
    } catch (err) {
      console.error(err);
    }
  }

  // EDIÇÃO
  const abrirModalEdicao = async () => {
    setEditNome(musica.nome);
    setEditLore(musica.lore || "");
    setEditBandaId(musica.bandaID);
    await carregarAlbunsDaBanda(musica.bandaID);
    setEditAlbumId(musica.albumID);
    setShowEditModal(true);
  };

  const salvarEdicao = async () => {
    if (!editNome.trim()) return;
    try {
      await api(`http://localhost:8080/musicas/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: editNome,
          lore: editLore || null,
          banda: { id: Number(editBandaId) },
          album: { id: Number(editAlbumId) },
        }),
      });
      await carregarMusica();
      setShowEditModal(false);
    } catch (err) {
      console.error("Erro ao editar música:", err);
    }
  };

  // DELETE
  const deletarMusica = async () => {
    if (!window.confirm("Deseja realmente excluir esta música?")) return;
    try {
      await api(`http://localhost:8080/musicas/${id}`, { method: "DELETE" });
      navigate("/musicas");
    } catch (err) {
      console.error("Erro ao deletar música:", err);
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
      await api(`http://localhost:8080/comments/musicas/${id}`, {
        method: "POST",
        body: JSON.stringify({ texto: novoComentario }),
      });
      await carregarMusica();
      setShowCommentModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!musica) return <p className={styles.loading}>Música não encontrada.</p>;

  return (
    <div className={styles.container}>
      {/* TOP: imagem + título + favoritos + ações */}
      <div className={styles.top}>
        {bandaImage ? (
          <img src={bandaImage} alt={musica.bandaNome} className={styles.albumCover} />
        ) : (
          <div className={styles.albumCoverPlaceholder}>🎵</div>
        )}

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{musica.nome}</h1>

          <div className={styles.metaRow}>
            <Link to={`/bands/${musica.bandaID}`} className={styles.bandLink}>
              {musica.bandaNome}
            </Link>
            <span className={styles.year}>{musica.albumNome || "—"}</span>
          </div>

          <div className={styles.actionsRow}>
            <button className={styles.favoriteBtn} onClick={toggleFavorito}>
              {isFav ? "❤️" : "🤍"}
            </button>
            <button className={styles.editBtn} onClick={abrirModalEdicao}>Editar</button>
            <button className={styles.deleteBtn} onClick={deletarMusica}>Deletar</button>
          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Descrição</h2>
        <div className={styles.cardBox}>
          <p className={styles.descriptionText}>{musica.lore || "Sem descrição disponível."}</p>
        </div>
      </section>

      {/* COMENTÁRIOS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Comentários</h2>
          <button className={styles.addCommentBtn} onClick={abrirModalComentario}>
            + Comentar
          </button>
        </div>

        {musica.comentarios?.length > 0 ? (
          <ul className={styles.commentsList}>
            {musica.comentarios.map((c, i) => (
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
              <button className={styles.modalBtn} onClick={salvarComentario}>Enviar</button>
              <button className={`${styles.modalBtn} ${styles.cancelBtn}`} onClick={() => setShowCommentModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Editar Música</h3>
            <input className={styles.modalInput} value={editNome} onChange={(e) => setEditNome(e.target.value)} />
            <textarea className={styles.modalTextarea} value={editLore} onChange={(e) => setEditLore(e.target.value)} />

            <select className={styles.modalInput} value={editBandaId} onChange={(e) => setEditBandaId(e.target.value)}>
              <option value="">Selecione a banda...</option>
              {bandas.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>

            <select className={styles.modalInput} value={editAlbumId} onChange={(e) => setEditAlbumId(e.target.value)}>
              <option value="">Selecione o álbum...</option>
              {albuns.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>

            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={salvarEdicao}>Salvar</button>
              <button className={`${styles.modalBtn} ${styles.cancelBtn}`} onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
