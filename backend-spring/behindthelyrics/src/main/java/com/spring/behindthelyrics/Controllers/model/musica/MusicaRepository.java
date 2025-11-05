package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicaRepository extends JpaRepository<Musica, Long> {

    // 🔍 Busca parcial por nome (case insensitive)
    List<Musica> findByNomeContainingIgnoreCase(String nome);

    // 🎵 Buscar músicas de um álbum específico
    List<Musica> findByAlbumId(Long albumId);

    // 🎸 Buscar músicas de uma banda específica
    List<Musica> findByBandaId(Long bandaId);

    // 🔗 Buscar música com álbum e banda já carregados (JOIN FETCH)
    @Query("SELECT m FROM Musica m " +
           "LEFT JOIN FETCH m.album " +
           "LEFT JOIN FETCH m.banda " +
           "LEFT JOIN FETCH m.comentarios " +
           "WHERE m.id = :id")
    Optional<Musica> findByIdWithDetails(Long id);

    @Query("SELECT m FROM Musica m ORDER BY m.id DESC")
    List<Musica> findLastAddedSongs(Pageable pageable);
}