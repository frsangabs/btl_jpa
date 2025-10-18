package com.spring.behindthelyrics.Controllers.model.musica;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;

import jakarta.persistence.Column;
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
@Entity
@NoArgsConstructor
@Table(name = "musicas")

public class Musica{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int ano_lancamento;

    private String titulo;

    @Column
    private String loreMsc;

    // Relacionamento com Banda
    @ManyToOne
    @JoinColumn(name = "banda_id")
    private Banda banda;

    // Relacionamento com Álbum
    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;


    public Musica(int ano_lancamento, String titulo, String loreMsc, Banda banda, Album album) {
        this.ano_lancamento = ano_lancamento;
        this.titulo = titulo;
        this.loreMsc = loreMsc;
        this.banda = banda;
        this.album = album;
    }

}
