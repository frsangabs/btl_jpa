import React, { createContext, useContext, useEffect, useState } from "react";
import { setToken as saveToken, getToken, removeToken } from "../auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider mantém token no estado e localStorage.
 * login(email, password) => faz POST /auth/login e salva token.
 * logout() => remove token e redireciona para /login.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const navigate = useNavigate();

  useEffect(() => {
    // sincroniza localStorage caso token seja alterado fora do contexto
    const onStorage = () => {
      setToken(getToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async ({ username, password }) => {
    // adapte a URL/corpo conforme seu backend
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Erro ao logar");
    }

    const data = await res.json();
    const jwt = data.token;
    if (!jwt) throw new Error("Resposta do servidor não retornou token");

    saveToken(jwt);
    setToken(jwt);
    return jwt;
  };

  const logout = () => {
    removeToken();
    setToken(null);
    navigate("/login", { replace: true });
  };

  const value = {
    token,
    isLogged: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
