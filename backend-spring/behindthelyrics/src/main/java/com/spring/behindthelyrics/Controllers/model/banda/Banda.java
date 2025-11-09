package com.spring.behindthelyrics.Controllers.model.banda;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.comentario.Comentario;
import com.spring.behindthelyrics.Controllers.model.favorito.Favorito;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@Entity
@Table(name = "bandas")
public class Banda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = true)
    private String lore;

    @OneToMany(mappedBy = "banda", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "banda-albuns")
    private List<Album> albuns;

    @OneToMany(mappedBy = "banda", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "banda-musicas")
    private List<Musica> musicas;

    @OneToMany(mappedBy = "banda", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "banda", cascade = CascadeType.ALL)
    private List<Favorito> favoritos;

    public Banda(String nome, String lore) {
    this.nome = nome;
    this.lore = lore;
    this.albuns = new ArrayList<>();
    this.musicas = new ArrayList<>();
    this.comentarios = new ArrayList<>();
    this.favoritos = new ArrayList<>();
}


    


}
