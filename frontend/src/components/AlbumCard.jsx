// src/components/AlbumCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import useSpotifyImage from "../hooks/useSpotifyImage";
import styles from "../pages/DetalheBanda.module.css";

export default function AlbumCard({ album }) {
  const img = useSpotifyImage("album", album.nome);

  return (
    <Link to={`/albuns/${album.id}`} className={styles.albumCard}>
      <img
        src={img || "/placeholder-album.png"}
        alt={album.nome}
        className={styles.albumImg}
      />
      <p className={styles.albumName}>{album.nome}</p>
    </Link>
  );
}
