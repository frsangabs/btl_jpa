package com.spring.behindthelyrics.Controllers.model.comentario;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "banda_id")
    @JsonBackReference
    private Banda banda;

    @ManyToOne
    @JoinColumn(name = "album_id")
    @JsonBackReference
    private Album album;

    @ManyToOne
    @JoinColumn(name = "musica_id")
    @JsonBackReference
    private Musica musica;

    public Comentario(String texto, Usuario usuario, Banda banda, Album album, Musica musica) {
        this.texto = texto;
        this.usuario = usuario;
        this.banda = banda;
        this.album = album;
        this.musica = musica;
        this.dataCriacao = LocalDateTime.now();
    }
}