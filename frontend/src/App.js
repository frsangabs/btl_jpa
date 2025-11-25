import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bandas from "./pages/Bandas";
import DetalheBanda from "./pages/DetalheBanda";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/bands" element={<Bandas />} />
        <Route path="/bands/:id" element={<DetalheBanda />} />
      </Routes>
    </BrowserRouter>
  );
}
