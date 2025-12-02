package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.comentario.Comentario;
import com.spring.behindthelyrics.Controllers.model.favorito.Favorito;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "musicas")
public class Musica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String lore;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "album_id")
    @JsonBackReference(value = "album-musicas")
    private Album album;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "banda_id")
    @JsonBackReference(value = "banda-musicas")
    private Banda banda;

    @OneToMany(mappedBy = "musica", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "musica-comentarios")
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "musica", cascade = CascadeType.ALL)
    private List<Favorito> favoritos;


    public Musica(String nome, String lore, Album album, Banda banda) {
        this.nome = nome;
        this.lore = lore;
        this.album = album;
        this.banda = banda;
        this.comentarios = new ArrayList<>();
        this.favoritos = new ArrayList<>();
}

public Musica(Long id) {
    this.id = id;
}


}
