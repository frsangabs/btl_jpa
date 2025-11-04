package com.spring.behindthelyrics.Controllers.model.album;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    // 🔍 Busca parcial por nome (case insensitive)
    List<Album> findByNomeContainingIgnoreCase(String nome);

    // 🔹 Busca todos os álbuns de uma banda específica
    List<Album> findByBandaId(Long bandaId);

    // 🔗 Puxa um álbum com músicas, comentários e favoritos (JOIN FETCH)
    @Query("SELECT a FROM Album a " +
           "LEFT JOIN FETCH a.musicas " +
           "LEFT JOIN FETCH a.comentarios " +
           "LEFT JOIN FETCH a.favoritos " +
           "WHERE a.id = :id")
    Optional<Album> findByIdWithAllRelations(Long id);
}
