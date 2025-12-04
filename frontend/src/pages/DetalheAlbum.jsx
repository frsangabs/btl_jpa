import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheAlbum() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  const [bandas, setBandas] = useState([]);

  // ==== EDIÇÃO ====
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");
  const [editAno, setEditAno] = useState("");
  const [editBandaId, setEditBandaId] = useState("");

  // ==== COMENTÁRIO ====
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  // ==========================
  // CARREGAR BANDAS
  // ==========================
  useEffect(() => {
    api("http://localhost:8080/bands")
      .then(setBandas)
      .catch(err => console.error("Erro ao carregar bandas:", err));
  }, []);

  // ==========================
  // CARREGAR ALBUM
  // ==========================
  useEffect(() => {
    api(`http://localhost:8080/albuns/${id}`)
      .then(data => {
        setAlbum(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, [id]);

  // ==========================
  // VERIFICAR FAVORITO
  // ==========================
  useEffect(() => {
    verificarFavorito();
  }, [id]);

  async function verificarFavorito() {
    try {
      const favs = await api("http://localhost:8080/favoritos");
      const jaFav = favs.albuns?.some(a => a.id === Number(id));
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

  // ==========================
  // EDIÇÃO
  // ==========================
  const abrirModalEdicao = () => {
    setEditNome(album.nome);
    setEditLore(album.lore || "");
    setEditAno(album.ano_lancamento);
    setEditBandaId(album.bandaId);
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

  // ==========================
  // DELETE
  // ==========================
  const deletarAlbum = async () => {
    if (!window.confirm("Deseja realmente excluir este álbum?")) return;

    try {
      await api(`http://localhost:8080/albuns/${id}`, {
        method: "DELETE",
      });

      navigate("/albuns");

    } catch (err) {
      console.error("Erro ao deletar álbum:", err);
    }
  };

  // ==========================
  // COMENTÁRIO
  // ==========================
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

  // ==========================
  // RENDER
  // ==========================
  if (loading) return <p>Carregando...</p>;
  if (!album) return <p>Álbum não encontrado.</p>;

  return (
    <div>
      <h1>{album.nome}</h1>

      {/* FAVORITO */}
      <button
        onClick={toggleFavorito}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 32,
          marginLeft: 10
        }}
      >
        {isFav ? "❤️" : "🤍"}
      </button>

      {/* AÇÕES */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <button onClick={abrirModalEdicao} style={{ marginRight: 10 }}>
          Editar Álbum
        </button>

        <button
          onClick={deletarAlbum}
          style={{ background: "red", color: "white", marginRight: 10 }}
        >
          Deletar Álbum
        </button>

        <button onClick={abrirModalComentario}>
          Adicionar Comentário
        </button>
      </div>

      <p>
        <strong>Banda:</strong>{" "}
        <Link to={`/bands/${album.bandaId}`}>{album.bandaNome}</Link>
      </p>

      <p><strong>Ano de lançamento:</strong> {album.ano_lancamento}</p>
      <p><strong>Descrição:</strong> {album.lore}</p>

      {album.musicas?.length > 0 && (
        <>
          <h2>Músicas</h2>
          <ul>
            {album.musicas.map(m => (
              <li key={m.id}>
                <Link to={`/musicas/${m.id}`}>{m.nome}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {album.comentarios?.length > 0 && (
        <>
          <h2>Comentários</h2>
          <ul>
            {album.comentarios.map((c, i) => (
              <li key={i}>
                <strong>{c.usuario}</strong>: {c.texto}
                <br />
                <small>{new Date(c.data).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* =====================================
              MODAL DE COMENTÁRIO
      ====================================== */}
      {showCommentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            width: 300
          }}>
            <h2>Novo Comentário</h2>

            <textarea
              rows={3}
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={salvarComentario}>Enviar</button>
              <button onClick={() => setShowCommentModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
              MODAL DE EDIÇÃO
      ====================================== */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ background: "#fff", padding: 20, width: 350, borderRadius: 8 }}>
            <h2>Editar Álbum</h2>

            <label>Nome</label>
            <input
              type="text"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Lore (opcional)</label>
            <textarea
              value={editLore}
              onChange={(e) => setEditLore(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Ano de lançamento</label>
            <input
              type="number"
              value={editAno}
              onChange={(e) => setEditAno(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Banda</label>
            <select
              value={editBandaId}
              onChange={(e) => setEditBandaId(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <option value="">Selecione...</option>
              {bandas.map(b => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>

            <button onClick={salvarEdicao} style={{ marginRight: 10 }}>
              Salvar
            </button>

            <button onClick={() => setShowEditModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
