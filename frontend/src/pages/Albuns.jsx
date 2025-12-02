import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Albuns() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/albuns")
      .then(res => res.json())
      .then(data => {
        setAlbuns(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar álbuns:", err));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Álbuns</h1>

      <ul>
        {albuns.map(a => (
          <li key={a.id}>
            <Link to={`/albuns/${a.id}`}>
              {a.nome}
            </Link>{" "}
            — <small>{a.bandaNome}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
