package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicaRepository extends JpaRepository<Musica, Integer> {

    // Retorna todas as músicas de uma banda
    List<Musica> findByBandaId(Integer bandaId);

    // Retorna todas as músicas de um álbum
    List<Musica> findByAlbumId(Integer albumId);

    // Retorna as 5 músicas mais recentes
    List<Musica> findTop5ByOrderByIdDesc();
}
