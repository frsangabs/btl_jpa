import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Bandas from "./pages/Bandas";
import DetalheBanda from "./pages/DetalheBanda";
import Albuns from "./pages/Albuns";
import DetalheAlbum from "./pages/DetalheAlbum";
import Musicas from "./pages/Musicas";
import DetalheMusica from "./pages/DetalheMusica";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  return (

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bands" element={<Bandas />} />
          <Route path="/bands/:id" element={<DetalheBanda />} />
          <Route path="/albuns" element={<Albuns />} />
          <Route path="/albuns/:id" element={<DetalheAlbum />} />
          <Route path="/musicas" element={<Musicas />} />
          <Route path="/musicas/:id" element={<DetalheMusica />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Login SEM navbar */}
        <Route path="/login" element={<Login />} />
      </Routes>

   
  );
}
