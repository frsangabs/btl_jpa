import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======= INSERIR MÚSICA =======
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

  // ======= SALVAR NOVA MÚSICA =======
  const salvarNovaMusica = async () => {
    if (!newNome.trim() || !newBandaNome.trim()) return;

    try {
      await api("http://localhost:8080/musicas", {
        method: "POST",
        body: JSON.stringify({
          nome: newNome,
          lore: newLore || null,
          bandaNome: newBandaNome,
          albumNome: newAlbumNome || null
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

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Músicas</h1>

      {/* BOTÃO DE INSERIR */}
      <button onClick={() => setShowAddModal(true)}>
        ➕ Inserir Música
      </button>

      {/* LISTA */}
      <ul>
        {musicas.map(m => {
          const isFav = favoritas.includes(m.id);

          return (
            <li key={m.id}>
              <Link to={`/musicas/${m.id}`}>{m.nome}</Link>{" "}
              —{" "}
              <Link to={`/bands/${m.bandaID}`}>{m.bandaNome}</Link>{" "}
              <span style={{ fontSize: 20 }}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* MODAL DE ADICIONAR */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            minWidth: 300
          }}>
            <h2>Adicionar Música</h2>

            <input
              type="text"
              placeholder="Nome da música"
              value={newNome}
              onChange={e => setNewNome(e.target.value)}
            /><br />

            <textarea
              placeholder="Lore (opcional)"
              value={newLore}
              onChange={e => setNewLore(e.target.value)}
            /><br />

            <input
              type="text"
              placeholder="Nome da banda"
              value={newBandaNome}
              onChange={e => setNewBandaNome(e.target.value)}
            /><br />

            <input
              type="text"
              placeholder="Nome do álbum (opcional)"
              value={newAlbumNome}
              onChange={e => setNewAlbumNome(e.target.value)}
            /><br /><br />

            <button onClick={salvarNovaMusica}>Salvar</button>
            <button onClick={() => setShowAddModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}
