package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.album.AlbumRepository;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.banda.BandaRepository;

@Service
public class MusicaService {

    @Autowired
    private MusicaRepository musicaRepository;

    @Autowired
    private BandaRepository bandaRepository;

    @Autowired
    private AlbumRepository albumRepository;

    // --- Adicionar música (criando banda e álbum se necessário)
    public Musica adicionarMusica(Musica msc) {
        if (msc.getBanda() == null || msc.getBanda().getNome() == null) {
            throw new IllegalArgumentException("A banda é obrigatória para cadastrar uma música.");
        }

        // --- Verifica se a banda existe ---
        Banda banda = bandaRepository.findByNome(msc.getBanda().getNome())
                .orElseGet(() -> {
                    Banda novaBanda = new Banda();
                    novaBanda.setNome(msc.getBanda().getNome());
                    return bandaRepository.save(novaBanda);
                });

        // --- Verifica se o álbum existe (opcional) ---
        Album album = null;
        if (msc.getAlbum() != null && msc.getAlbum().getNome() != null) {
            album = albumRepository.findById(msc.getAlbum().getId())
                    .orElseGet(() -> {
                        Album novoAlbum = new Album();
                        novoAlbum.setNome(msc.getAlbum().getNome());
                        novoAlbum.setBanda(banda);
                        return albumRepository.save(novoAlbum);
                    });
        }

        // --- Salva música associada ---
        msc.setBanda(banda);
        msc.setAlbum(album);
        return musicaRepository.save(msc);
    }

    public List<Musica> puxarTodasMusicas() {
        return musicaRepository.findAll();
    }

    public Optional<Musica> puxarMusica(int id) {
        return musicaRepository.findById(id);
    }

    public List<Musica> puxarMusicasPorBanda(int bandaId) {
        return musicaRepository.findByBandaId(bandaId);
    }

    public List<Musica> puxarMusicasPorAlbum(int albumId) {
        return musicaRepository.findByAlbumId(albumId);
    }

    public List<Musica> puxar5Musicas() {
        return musicaRepository.findTop5ByOrderByIdDesc();
    }

    public Musica atualizarMusica(Musica dadosAtualizados, int id) {
        return musicaRepository.findById(id).map(msc -> {
            msc.setTitulo(dadosAtualizados.getTitulo());
            msc.setAno_lancamento(dadosAtualizados.getAno_lancamento());
            msc.setLoreMsc(dadosAtualizados.getLoreMsc());
            return musicaRepository.save(msc);
        }).orElseThrow(() -> new RuntimeException("Música não encontrada"));
    }

    public void deletar(int id) {
        musicaRepository.deleteById(id);
    }
}