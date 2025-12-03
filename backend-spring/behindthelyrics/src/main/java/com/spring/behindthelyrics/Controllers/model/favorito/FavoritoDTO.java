package com.spring.behindthelyrics.Controllers.model.favorito;

public record  FavoritoDTO (
        Long id,
        String nome,
        String tipo // "banda", "album", "musica"
){}
