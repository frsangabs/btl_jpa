import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bandas from "./pages/Bandas";
import DetalheBanda from "./pages/DetalheBanda";
import Albuns from "./pages/Albuns";
import DetalheAlbum from "./pages/DetalheAlbum";
import Musicas from "./pages/Musicas";
import DetalheMusica from "./pages/DetalheMusica";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/bands" element={<Bandas />} />
        <Route path="/bands/:id" element={<DetalheBanda />} />
        <Route path="/albuns" element={<Albuns />} />
        <Route path="/albuns/:id" element={<DetalheAlbum />} />
        <Route path="/musicas" element={<Musicas />} />
        <Route path="/musicas/:id" element={<DetalheMusica />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
