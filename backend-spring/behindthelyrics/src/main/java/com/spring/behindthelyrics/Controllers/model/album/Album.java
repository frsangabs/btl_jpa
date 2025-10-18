package com.spring.behindthelyrics.Controllers.model.album;

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

@Entity
@Data
@NoArgsConstructor
@Table(name = "albuns")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    private int ano_lancamento;


    // Relacionamento com Banda (muitos álbuns para uma banda)
    @ManyToOne
    @JoinColumn(name = "banda_id", nullable = false)
    private Banda banda;


    public Album(String nome, int ano_lancamento, Banda banda) {
        this.nome = nome;
        this.ano_lancamento = ano_lancamento;
        this.banda = banda;
    }
}