import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { favoritar, desfavoritar } from "../services/favoritoApi";

export default function DetalheBanda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [banda, setBanda] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal de edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editLore, setEditLore] = useState("");

  // Modal de comentário
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    carregarDetalhes();
    verificarFavorito();
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
      const jaFav = favs.bandas?.some(b => b.id === Number(id));
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

  // ======= EDIÇÃO =======
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

  // ======= DELETE =======
  const deletarBanda = async () => {
    if (!window.confirm("Deseja realmente excluir esta banda?")) return;
    try {
      await api(`http://localhost:8080/bands/${id}`, { method: "DELETE" });
      navigate("/bands");
    } catch (err) {
      console.error("Erro ao deletar banda:", err);
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
    <div style={{ padding: 20 }}>
      <h1>{banda.nome}</h1>
      <button
        onClick={toggleFavorito}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 32, marginLeft: 10 }}
      >
        {isFav ? "❤️" : "🤍"}
      </button>

      <p><strong>Descrição:</strong> {banda.lore}</p>

      {/* Botões de ação */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={abrirModalEdicao} style={{ marginRight: 10, padding: "6px 12px" }}>Editar Banda</button>
        <button onClick={deletarBanda} style={{ padding: "6px 12px", background: "red", color: "#fff" }}>Deletar Banda</button>
        <button onClick={abrirModalComentario} style={{ padding: "6px 12px", marginLeft: 10 }}>Adicionar Comentário</button>
      </div>

      {/* Modal de edição */}
      {showEditModal && (
        <div style={{ position: "fixed", top:0,left:0,right:0,bottom:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ backgroundColor:"#fff", padding:20, borderRadius:8, minWidth:300 }}>
            <h2>Editar Banda</h2>
            <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome da banda" style={{ width:"100%", padding:6, marginBottom:10 }}/>
            <textarea value={editLore} onChange={e => setEditLore(e.target.value)} placeholder="Lore (opcional)" rows={3} style={{ width:"100%", padding:6, marginBottom:10 }}/>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={salvarEdicao} style={{ padding:"6px 12px" }}>Salvar</button>
              <button onClick={() => setShowEditModal(false)} style={{ padding:"6px 12px" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comentário */}
      {showCommentModal && (
        <div style={{ position: "fixed", top:0,left:0,right:0,bottom:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ backgroundColor:"#fff", padding:20, borderRadius:8, minWidth:300 }}>
            <h2>Novo Comentário</h2>
            <textarea value={novoComentario} onChange={e => setNovoComentario(e.target.value)} placeholder="Escreva seu comentário..." rows={3} style={{ width:"100%", padding:6, marginBottom:10 }}/>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={salvarComentario} style={{ padding:"6px 12px" }}>Enviar</button>
              <button onClick={() => setShowCommentModal(false)} style={{ padding:"6px 12px" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {banda.albuns?.length > 0 && (
        <>
          <h2>Álbuns</h2>
          <ul>
            {banda.albuns.map(a => (
              <li key={a.id}><Link to={`/albuns/${a.id}`}>{a.nome}</Link></li>
            ))}
          </ul>
        </>
      )}

      {banda.musicas?.length > 0 && (
        <>
          <h2>Músicas</h2>
          <ul>
            {banda.musicas.map(m => (
              <li key={m.id}><Link to={`/musicas/${m.id}`}>{m.nome}</Link></li>
            ))}
          </ul>
        </>
      )}

      {banda.comentarios?.length > 0 && (
        <>
          <h2>Comentários</h2>
          <ul>
            {banda.comentarios.map((c, idx) => (
              <li key={idx}><strong>{c.usuario}:</strong> {c.texto} <em>({new Date(c.data).toLocaleString()})</em></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
