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
    List<Banda> findByNameContainingIgnoreCase(String nome);

    @Query("""
        SELECT DISTINCT b FROM Banda b
        LEFT JOIN FETCH b.albuns a
        LEFT JOIN FETCH b.musicas m
        LEFT JOIN FETCH b.comentarios c
        WHERE b.id = :id
    """)
    Optional<Banda> findByIdWithAllRelations(@Param("id") Long id);
}


