package com.spring.behindthelyrics.Controllers.model.album;

import java.util.ArrayList;
import java.util.List;

import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.comentario.Comentario;
import com.spring.behindthelyrics.Controllers.model.favorito.Favorito;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Table(name = "albuns")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nome;

    @Column(nullable = true)
    private String lore;

    private int ano_lancamento;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "banda_id", nullable = false)
    private Banda banda;

    @OneToMany(mappedBy = "album")
    private List<Musica> musicas;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    private List<Favorito> favoritos;

    public Album(String nome, String lore, int ano_lancamento, Banda banda) {
    this.nome = nome;
    this.lore = lore;
    this.ano_lancamento = ano_lancamento;
    this.banda = banda;
    this.musicas = new ArrayList<>();
    this.comentarios = new ArrayList<>();
    this.favoritos = new ArrayList<>();
}

}
