import api from "../api";

export function favoritar(tipo, id) {
  return api(`http://localhost:8080/favoritos/${tipo}/${id}`, {
    method: "POST"
  });
}

export function desfavoritar(tipo, id) {
  return api(`http://localhost:8080/favoritos/${tipo}/${id}`, {
    method: "DELETE"
  });
}

export function listarFavoritos() {
  return api("http://localhost:8080/favoritos");
}
