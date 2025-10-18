package com.spring.behindthelyrics.Controllers.model.banda;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BandaRepository extends JpaRepository<Banda, Integer> {

    // Buscar banda pelo nome (usado para evitar duplicatas ao adicionar música)
    Optional<Banda> findByNome(String nome);

    // Top 3 bandas com mais músicas
    @Query("""
        SELECT b FROM Banda b 
        LEFT JOIN b.musicas m 
        GROUP BY b 
        ORDER BY COUNT(m) DESC
    """)
    List<Banda> findTop3Bandas();
}