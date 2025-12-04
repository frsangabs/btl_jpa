import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Albuns() {
  const [albuns, setAlbuns] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Estados para criação de álbum
  // ==============================
  const [showModal, setShowModal] = useState(false);
  const [albumNome, setAlbumNome] = useState("");
  const [albumLore, setAlbumLore] = useState("");
  const [albumAno, setAlbumAno] = useState("");
  const [albumBandaId, setAlbumBandaId] = useState("");

  const [bandas, setBandas] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const listaAlbuns = await api("http://localhost:8080/albuns");
        const favs = await api("http://localhost:8080/favoritos");
        const listaBandas = await api("http://localhost:8080/bands");

        setBandas(listaBandas);

        const favAlbuns = favs.albuns?.map(a => a.id) || [];

        setAlbuns(listaAlbuns);
        setFavoritas(favAlbuns);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    carregar();
  }, []);

  // ==============================
  // Criar álbum
  // ==============================
  const criarAlbum = async () => {
    if (!albumNome.trim() || !albumBandaId) {
      alert("Nome e Banda são obrigatórios!");
      return;
    }

    try {
      const novo = await api("http://localhost:8080/albuns", {
        method: "POST",
        body: JSON.stringify({
          nome: albumNome,
          lore: albumLore || null,
          ano_lancamento: albumAno ? Number(albumAno) : 0,
          bandaId: Number(albumBandaId)
        }),
      });

      setAlbuns(prev => [...prev, novo]);
      setAlbumNome("");
      setAlbumLore("");
      setAlbumAno("");
      setAlbumBandaId("");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar álbum:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Álbuns</h1>

      {/* BOTÃO PARA ABRIR MODAL */}
      <button
        onClick={() => setShowModal(true)}
        style={{ marginBottom: 20, padding: "8px 16px" }}
      >
        Adicionar Álbum
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 350
            }}
          >
            <h2>Novo Álbum</h2>

            <input
              type="text"
              value={albumNome}
              onChange={e => setAlbumNome(e.target.value)}
              placeholder="Nome do álbum (obrigatório)"
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            <textarea
              value={albumLore}
              onChange={e => setAlbumLore(e.target.value)}
              placeholder="Lore (opcional)"
              rows={3}
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            <input
              type="number"
              value={albumAno}
              onChange={e => setAlbumAno(e.target.value)}
              placeholder="Ano de lançamento (opcional)"
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            />

            {/* SELECT DE BANDAS */}
            <select
              value={albumBandaId}
              onChange={e => setAlbumBandaId(e.target.value)}
              style={{ width: "100%", padding: 6, marginBottom: 10 }}
            >
              <option value="">Selecione a banda...</option>

              {bandas.map(b => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={criarAlbum} style={{ padding: "6px 12px" }}>
                Salvar
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "6px 12px" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE ÁLBUNS */}
      <ul>
        {albuns.map(a => {
          const isFav = favoritas.includes(a.id);

          return (
            <li key={a.id} style={{ marginBottom: 8 }}>
              <Link to={`/albuns/${a.id}`}>{a.nome}</Link>{" "}
              — <Link to={`/bands/${a.bandaId}`}>{a.bandaNome}</Link>{" "}
              <span style={{ fontSize: 20 }}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
