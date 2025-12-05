// src/pages/DetalheBanda.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";
import useSpotifyImage from "../hooks/useSpotifyImage";
import AlbumCard from "../components/AlbumCard";
import styles from "./DetalheBanda.module.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function DetalheBanda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [banda, setBanda] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modais e campos
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  const bandImg = useSpotifyImage("artist", banda?.nome);

  useEffect(() => {
    carregarDetalhes();
    verificarFavorito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarDetalhes() {
    try {
      const data = await api(`http://localhost:8080/bands/${id}`);
      setBanda(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err);
      setLoading(false);
    }
  }

  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");
      const jaFav = favs.bandas?.some((b) => b.id === Number(id));
      setIsFav(!!jaFav);
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  }

  async function toggleFavorito() {
    try {
      if (isFav) {
        await desfavoritar("bands", id);
        setIsFav(false);
      } else {
        await favoritar("bands", id);
        setIsFav(true);
      }
    } catch (err) {
      console.error("Erro ao favoritar/desfavoritar:", err);
    }
  }

  // Edição
  const abrirModalEdicao = () => {
    setEditNome(banda.nome);
    setEditLore(banda.lore || "");
    setShowEditModal(true);
  };

  const salvarEdicao = async () => {
    if (!editNome.trim()) return;
    try {
      await api(`http://localhost:8080/bands/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome: editNome, lore: editLore || null }),
      });
      const atualizado = await api(`http://localhost:8080/bands/${id}`);
      setBanda(atualizado);
      setShowEditModal(false);
    } catch (err) {
      console.error("Erro ao atualizar banda:", err);
    }
  };

  const deletarBanda = async () => {
    if (!window.confirm("Deseja realmente excluir esta banda?")) return;
    try {
      await api(`http://localhost:8080/bands/${id}`, { method: "DELETE" });
      navigate("/bands");
    } catch (err) {
      console.error("Erro ao deletar banda:", err);
    }
  };

  // Comentários
  const abrirModalComentario = () => {
    setNovoComentario("");
    setShowCommentModal(true);
  };

  const salvarComentario = async () => {
    if (!novoComentario.trim()) return;
    try {
      await api(`http://localhost:8080/comments/bands/${id}`, {
        method: "POST",
        body: JSON.stringify({ texto: novoComentario }),
      });
      const atualizado = await api(`http://localhost:8080/bands/${id}`);
      setBanda(atualizado);
      setShowCommentModal(false);
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!banda) return <p>Banda não encontrada.</p>;

  return (
    <div className={styles.container}>
      {/* top area: imagem + title + actions */}
      <div className={styles.header}>
        <div className={styles.bandInfo}>
          <img
            src={bandImg || "/placeholder-band.png"}
            alt={banda.nome}
            className={styles.bandImage}
          />
          <div className={styles.titleWrap}>
            <h1 className={styles.bandName}>{banda.nome}</h1>
            <button
              className={styles.favoriteBtn}
              onClick={toggleFavorito}
              aria-label={isFav ? "Desfavoritar" : "Favoritar"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={abrirModalEdicao}>
            Editar
          </button>
          <button className={styles.deleteBtn} onClick={deletarBanda}>
            Deletar
          </button>
        </div>
      </div>

      {/* descrição dinâmica */}
      <section className={styles.descriptionSection}>
        <h2>Descrição</h2>
        <p className={styles.descriptionText}>
          {banda.lore || "Sem descrição disponível."}
        </p>
      </section>

      {/* carrossel de álbuns */}
      {banda.albuns?.length > 0 && (
        <section className={styles.albumsSection}>
          <h2>Álbuns</h2>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              320: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
          >

            {banda.albuns.map((a) => (
              <SwiperSlide key={a.id}>
                <AlbumCard album={a} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* lista de músicas (vertical) */}
      {banda.musicas?.length > 0 && (
        <section className={styles.tracksSection}>
          <h2>Músicas</h2>
          <ul className={styles.trackList}>
            {banda.musicas.map((m) => (
              <li key={m.id} className={styles.trackItem}>
                <Link to={`/musicas/${m.id}`} className={styles.trackLink}>
                  {m.nome}
                </Link>
                <span className={styles.trackDuration}>{/* opcional */}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* comentários */}
      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h2>Comentários</h2>
          <button className={styles.addCommentBtn} onClick={abrirModalComentario}>
            + Comentar
          </button>
        </div>

        {banda.comentarios?.length > 0 ? (
          <ul className={styles.commentsList}>
            {banda.comentarios.map((c, idx) => (
              <li key={idx} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <strong>{c.usuario || "Anônimo"}</strong>
                  <span className={styles.commentDate}>
                    {new Date(c.data).toLocaleString()}
                  </span>
                </div>
                <p className={styles.commentText}>{c.texto}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noComments}>Seja o primeiro a comentar.</p>
        )}
      </section>

      {/* Edit modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Editar Banda</h3>
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

      {/* Comment modal */}
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
    </div>
  );
}
