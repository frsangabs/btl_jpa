package com.spring.behindthelyrics.Controllers.model.favorito;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;
import com.spring.behindthelyrics.Controllers.model.user.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "favoritos")
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "banda_id")
    @JsonIgnore
    private Banda banda;

    @ManyToOne
    @JoinColumn(name = "album_id")
    @JsonIgnore
    private Album album;

    @ManyToOne
    @JoinColumn(name = "musica_id")
    @JsonIgnore
    private Musica musica;

    public Favorito(Usuario usuario, Banda banda, Album album, Musica musica) {
        this.usuario = usuario;
        this.banda = banda;
        this.album = album;
        this.musica = musica;
    }
}