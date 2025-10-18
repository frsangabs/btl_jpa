package com.spring.behindthelyrics.Controllers.model.album;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {

    // Busca todos os álbuns de uma banda específica
    List<Album> findByBanda_Id(Integer bandaId);
}
