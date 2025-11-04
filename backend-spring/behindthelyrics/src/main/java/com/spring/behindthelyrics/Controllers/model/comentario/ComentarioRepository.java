package com.spring.behindthelyrics.Controllers.model.comentario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    // 🔹 Buscar comentários por ID de música
    List<Comentario> findByMusicaId(Long musicaId);

    // 🔹 Buscar comentários por ID de álbum
    List<Comentario> findByAlbumId(Long albumId);

    // 🔹 Buscar comentários por ID de banda
    List<Comentario> findByBandaId(Long bandaId);

    // 🔹 Buscar comentários por ID de usuário
    List<Comentario> findByUsuarioId(Long usuarioId);
}
