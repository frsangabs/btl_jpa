import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheMusica() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [musica, setMusica] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dados para edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");

  const [bandas, setBandas] = useState([]);
  const [albuns, setAlbuns] = useState([]);

  const [editBandaId, setEditBandaId] = useState("");
  const [editAlbumId, setEditAlbumId] = useState("");

  // ==== COMENTÁRIO ====
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    carregarMusica();
    carregarFavoritos();
    carregarBandas();
  }, [id]);

  async function carregarMusica() {
    try {
      const data = await api(`http://localhost:8080/musicas/${id}`);
      setMusica(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar música:", err);
    }
  }

  async function carregarFavoritos() {
    try {
      const favs = await api("http://localhost:8080/favoritos");
      const favorito = favs.musicas?.some(m => m.id === Number(id));
      setIsFav(!!favorito);
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  }

  async function carregarBandas() {
    try {
      const listaBandas = await api("http://localhost:8080/bands");
      setBandas(listaBandas);
    } catch (err) {
      console.error("Erro ao carregar bandas:", err);
    }
  }

  async function carregarAlbunsDaBanda(bandaId) {
  try {
    const listaAlbuns = await api(`http://localhost:8080/albuns/banda/${bandaId}`);

    // força virar array
      if (Array.isArray(listaAlbuns)) {
        setAlbuns(listaAlbuns);
      } else if (!listaAlbuns) {
        setAlbuns([]);
      } else {
        // se vier objeto único, transforma em array
        setAlbuns([listaAlbuns]);
      }

    } catch (err) {
      console.error("Erro ao carregar álbuns:", err);
      setAlbuns([]);
    }
  }


  async function toggleFavorito() {
    try {
      if (isFav) {
        await desfavoritar("musicas", id);
        setIsFav(false);
      } else {
        await favoritar("musicas", id);
        setIsFav(true);
      }
    } catch (err) {
      console.error("Erro ao alterar favorito:", err);
    }
  }

  // ======= MODAL DE EDIÇÃO =======
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
          lore: editLore,
          banda: { id: Number(editBandaId) },
          album: { id: Number(editAlbumId) }
        }),
      });

      await carregarMusica();
      setShowEditModal(false);
    } catch (err) {
      console.error("Erro ao editar música:", err);
    }
  };

  // ======= DELETAR =======
  const deletarMusica = async () => {
    if (!window.confirm("Deseja realmente excluir esta música?")) return;

    try {
      await api(`http://localhost:8080/musicas/${id}`, { method: "DELETE" });
      navigate("/musicas");
    } catch (err) {
      console.error("Erro ao deletar música:", err);
    }
  };

  // ======= COMENTÁRIO =======
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
      console.error("Erro ao criar comentário:", err);
    }
  };

  // ==========================
  //   RENDER
  // ==========================

  if (loading) return <p>Carregando...</p>;
  if (!musica) return <p>Música não encontrada.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>
        {musica.nome}
        <button
          onClick={toggleFavorito}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 32,
            marginLeft: 10,
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </h1>

      <p><strong>Descrição:</strong> {musica.lore}</p>

      <p>
        <strong>Banda:</strong>{" "}
        <Link to={`/bands/${musica.bandaID}`}>{musica.bandaNome}</Link>
      </p>

      <p>
        <strong>Álbum:</strong>{" "}
        <Link to={`/albuns/${musica.albumID}`}>{musica.albumNome}</Link>
      </p>

      <div style={{ marginTop: 20 }}>
        <button onClick={abrirModalEdicao} style={{ marginRight: 10 }}>
          Editar Música
        </button>

        <button
          onClick={deletarMusica}
          style={{ background: "red", color: "white" }}
        >
          Deletar Música
        </button>
        <button onClick={abrirModalComentario} style={{ marginLeft: 10 }}>
          Adicionar Comentário
        </button>
      </div>

      {/* ======= MODAL ======= */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, minWidth: 350 }}>
            <h2>Editar Música</h2>

            {/* Nome */}
            <input
              type="text"
              value={editNome}
              onChange={e => setEditNome(e.target.value)}
              placeholder="Nome da música"
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            {/* Lore */}
            <textarea
              value={editLore}
              onChange={e => setEditLore(e.target.value)}
              placeholder="Lore (opcional)"
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            {/* Banda */}
            <label>Banda:</label>
            <select
              value={editBandaId}
              onChange={async (e) => {
                const novaBanda = e.target.value;
                setEditBandaId(novaBanda);

                await carregarAlbunsDaBanda(novaBanda);
                setEditAlbumId("");
              }}
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            >
              <option value="">Selecione...</option>
              {bandas.map(b => (
                <option key={b.id} value={b.id}>{b.nome}</option>
              ))}
            </select>

            {/* Álbum */}
            <label>Álbum:</label>
            <select
              value={editAlbumId}
              onChange={e => setEditAlbumId(e.target.value)}
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            >
              <option value="">Selecione...</option>
              {albuns.map(a => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL DE COMENTÁRIO ======= */}
      {showCommentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, minWidth: 300 }}>
            <h2>Novo Comentário</h2>
            <textarea
              rows={3}
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Escreva seu comentário..."
              style={{ width: "100%", marginBottom: 10 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={salvarComentario}>Enviar</button>
              <button onClick={() => setShowCommentModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= COMENTÁRIOS ======= */}
      {musica.comentarios?.length > 0 && (
        <>
          <h2 style={{ marginTop: 20 }}>Comentários</h2>
          <ul>
            {musica.comentarios.map((c, i) => (
              <li key={i}>
                <strong>{c.usuario}</strong>: {c.texto}
                <br />
                <small>{new Date(c.data).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
