package com.spring.behindthelyrics.Controllers.model.banda;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BandaRepository extends JpaRepository<Banda, Long> {

    // 🔍 Busca parcial por nome (case insensitive)
    List<Banda> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT b FROM Banda b " +
       "LEFT JOIN FETCH b.albuns " +
       "LEFT JOIN FETCH b.musicas " +
       "LEFT JOIN FETCH b.comentarios " +
       "WHERE b.id = :id")
    Optional<Banda> findByIdWithAllRelations(@Param("id") Long id);
}


