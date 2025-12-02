import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("http://localhost:8080/musicas")
      .then(data => {
        setMusicas(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar músicas:", err));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Músicas</h1>

      <ul>
        {musicas.map(m => (
          <li key={m.id}>
            <Link to={`/musicas/${m.id}`}>
                {m.nome }
            </Link> — 
            <Link to={`/bands/${m.bandaID}`}>
                {m.bandaNome}
            </Link>
            
            
          </li>
        ))}
      </ul>
    </div>
  );
}
