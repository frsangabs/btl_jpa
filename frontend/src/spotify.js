let cachedToken = null;
let tokenExpiration = null;

const CLIENT_ID = "8cf639acc4774fde927de9f2cf6013aa";
const CLIENT_SECRET = "4fa002a6004c496aa7da82a2c9ed425c";

export async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiration) return cachedToken;

  const stored = localStorage.getItem("spotify_token");
  const exp = localStorage.getItem("spotify_token_exp");

  if (stored && exp && Date.now() < Number(exp)) {
    cachedToken = stored;
    tokenExpiration = Number(exp);
    return stored;
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();

  cachedToken = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000;

  localStorage.setItem("spotify_token", cachedToken);
  localStorage.setItem("spotify_token_exp", tokenExpiration);

  return cachedToken;
}

// ===============================================
// 🔥 Função: Buscar imagem de ARTISTA
// ===============================================
export async function searchSpotifyArtistImage(name) {
  const token = await getSpotifyToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      name
    )}&type=artist&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  return data.artists?.items?.[0]?.images?.[0]?.url || null;
}

// ===============================================
// 🔥 Função: Buscar imagem de ÁLBUM
// ===============================================
export async function searchAlbumImage(name) {
  const token = await getSpotifyToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      name
    )}&type=album&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  return data.albums?.items?.[0]?.images?.[0]?.url || null;
}

// ===============================================
// 🔥 Função: Buscar imagem de MÚSICA (track)
// ===============================================
export async function searchTrackImage(name) {
  const token = await getSpotifyToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      name
    )}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  return data.tracks?.items?.[0]?.album?.images?.[0]?.url || null;
}
// Preview da música
export async function searchTrackPreview(trackName, artistName) {
  const token = await getSpotifyToken();
  const query = encodeURIComponent(`${trackName} ${artistName}`);

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  return data.tracks?.items?.[0]?.preview_url || null;
}

