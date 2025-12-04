import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState(null);
  const [showBox, setShowBox] = useState(false);
  const boxRef = useRef();

  // Fechar popup ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowBox(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Buscar automaticamente enquanto digita
  useEffect(() => {
    if (query.trim() === "") {
      setResultados(null);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api(`http://localhost:8080/search?query=${query}`);
        setResultados(res);
        setShowBox(true);
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <nav style={styles.nav}>
      {/* Lado esquerdo */}
      <Link to="/" style={styles.brand}>behindTheLyrics</Link>

      {/* Barra de busca */}
      <div style={{ position: "relative" }} ref={boxRef}>
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={styles.search}
          onFocus={() => query && setShowBox(true)}
        />

        {/* Caixa de resultados */}
        {showBox && resultados && (
          <div style={styles.popup}>
            <h4>Bandas</h4>
            {resultados.bands?.length > 0 ? (
              resultados.bands.map(b => (
                <Link key={b.id} to={`/bands/${b.id}`} style={styles.item}>
                  {b.nome}
                </Link>
              ))
            ) : <p style={styles.empty}>Nenhuma banda encontrada</p>}

            <h4>Álbuns</h4>
            {resultados.albums?.length > 0 ? (
              resultados.albums.map(a => (
                <Link key={a.id} to={`/albuns/${a.id}`} style={styles.item}>
                  {a.nome}
                </Link>
              ))
            ) : <p style={styles.empty}>Nenhum álbum encontrado</p>}

            <h4>Músicas</h4>
            {resultados.songs?.length > 0 ? (
              resultados.songs.map(m => (
                <Link key={m.id} to={`/musicas/${m.id}`} style={styles.item}>
                  {m.nome}
                </Link>
              ))
            ) : <p style={styles.empty}>Nenhuma música encontrada</p>}
          </div>
        )}
      </div>

      {/* Lado direito */}
      <div style={styles.menu}>
        <Link to="/bands">Bandas</Link>
        <Link to="/albuns">Álbuns</Link>
        <Link to="/musicas">Músicas</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 25px",
    background: "#111",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  brand: {
    color: "white",
    fontSize: "22px",
    textDecoration: "none",
    fontWeight: "bold"
  },
  search: {
    padding: "8px 12px",
    width: "280px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#222",
    color: "white"
  },
  menu: {
    display: "flex",
    gap: "20px"
  },
  popup: {
    position: "absolute",
    top: "45px",
    left: 0,
    width: "350px",
    background: "#1b1b1b",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px",
    maxHeight: "400px",
    overflowY: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
  },
  item: {
    display: "block",
    padding: "5px 0",
    color: "#ccc",
    textDecoration: "none"
  },
  empty: {
    color: "#555",
    fontSize: "14px"
  }
};
