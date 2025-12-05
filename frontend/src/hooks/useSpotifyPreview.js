import { useState, useEffect } from "react";
import { getSpotifyToken } from "../spotify.js"; // ajuste o caminho conforme seu projeto

export default function useSpotifyPreview(trackName, artistName) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!trackName || !artistName) return;

    async function fetchSpotifyData() {
      try {
        const token = await getSpotifyToken(); // pega o token dinamicamente

        const query = encodeURIComponent(`${trackName} ${artistName}`);
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const track = data.tracks?.items?.[0];
         console.log("Spotify track encontrada:", track);
        if (track) {
          setPreviewUrl(track.preview_url);
          setImageUrl(track.album?.images?.[2]?.url); // imagem pequena
        }
      } catch (err) {
        console.error("Erro ao buscar Spotify:", err);
      }
    }

    fetchSpotifyData();
  }, [trackName, artistName]);

  return { previewUrl, imageUrl };
}
