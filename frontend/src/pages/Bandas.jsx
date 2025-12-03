import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Bandas() {
  const [bandas, setBandas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [novaBandaNome, setNovaBandaNome] = useState("");
  const [novaBandaLore, setNovaBandaLore] = useState(""); // campo opcional

  useEffect(() => {
    async function carregar() {
      try {
        const listaBandas = await api("http://localhost:8080/bands");
        const favs = await api("http://localhost:8080/favoritos");
        const favBandas = favs.bandas?.map(b => b.id) || [];

        setBandas(listaBandas);
        setFavoritas(favBandas);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregar();
  }, []);

  // Criar nova banda usando fetch via api
  const criarBanda = async () => {
    if (!novaBandaNome.trim()) return; // nome obrigatório

    try {
      const nova = await api("http://localhost:8080/bands", {
        method: "POST",
        body: JSON.stringify({
          nome: novaBandaNome,
          lore: novaBandaLore || null, // lore opcional
        }),
      });

      setBandas(prev => [...prev, nova]); // adiciona à lista
      setNovaBandaNome("");
      setNovaBandaLore("");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar banda:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Bandas</h1>

      {/* Botão para abrir modal */}
      <button
        onClick={() => setShowModal(true)}
        style={{ marginBottom: 20, padding: "8px 16px", cursor: "pointer" }}
      >
        Adicionar Banda
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            minWidth: 300
          }}>
            <h2>Nova Banda</h2>

            <input
              type="text"
              value={novaBandaNome}
              onChange={e => setNovaBandaNome(e.target.value)}
              placeholder="Nome da banda (obrigatório)"
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            <textarea
              value={novaBandaLore}
              onChange={e => setNovaBandaLore(e.target.value)}
              placeholder="Lore (opcional)"
              rows={3}
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={criarBanda} style={{ padding: "6px 12px" }}>Salvar</button>
              <button onClick={() => setShowModal(false)} style={{ padding: "6px 12px" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <ul style={{ marginTop: 20 }}>
        {bandas.map(b => {
          const isFav = favoritas.includes(b.id);
          return (
            <li key={b.id} style={{ marginBottom: 6 }}>
              <Link to={`/bands/${b.id}`}>{b.nome}</Link>{" "}
              <span style={{ fontSize: 20 }}>{isFav ? "❤️" : "🤍"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
