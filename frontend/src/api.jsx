// api.jsx
import { getToken, removeToken } from "./auth";

export default async function api(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Se houver token, injeta automaticamente
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Se o token expirou → Spring Security retorna 401
  if (response.status === 401) {
    removeToken();                 // remove token inválido
    window.location.href = "/login"; // redireciona para login
    throw new Error("Unauthorized");
  }

  // Tenta retornar JSON, se não for JSON retorna texto
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
