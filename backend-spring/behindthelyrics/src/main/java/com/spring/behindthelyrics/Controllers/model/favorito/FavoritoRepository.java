package com.spring.behindthelyrics.Controllers.model.favorito;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    // 🔹 Buscar favoritos por ID de usuário
    List<Favorito> findByUsuarioId(Long usuarioId);

    // 🔹 Buscar favoritos por ID de música
    List<Favorito> findByMusicaId(Long musicaId);

    // 🔹 Buscar favoritos por ID de álbum
    List<Favorito> findByAlbumId(Long albumId);

    // 🔹 Buscar favoritos por ID de banda
    List<Favorito> findByBandaId(Long bandaId);
}
