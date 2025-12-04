package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.album.AlbumRepository;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.banda.BandaRepository;

@Service
public class MusicaService {

    private final MusicaRepository musicaRepository;
    private final AlbumRepository albumRepository;
    private final BandaRepository bandaRepository;

    public MusicaService(MusicaRepository musicaRepository, AlbumRepository albumRepository, BandaRepository bandaRepository) {
        this.musicaRepository = musicaRepository;
        this.albumRepository = albumRepository;
        this.bandaRepository = bandaRepository;
    }

    public List<Musica> getAllSongs() {
        return musicaRepository.findAll();
    }

    public Optional<Musica> getSongById(Long id) {
        return musicaRepository.findById(id);
    }

    // 🔹 Get song with full details (album, banda, comentários)
    public Optional<Musica> getSongWithDetails(Long id) {
        return musicaRepository.findByIdWithDetails(id);
    }

    public List<Musica> searchSongsByName(String name) {
        return musicaRepository.findByNomeContainingIgnoreCase(name);
    }

    public List<Musica> getSongsByAlbum(Long albumId) {
        return musicaRepository.findByAlbumId(albumId);
    }

    public List<Musica> getSongsByBand(Long bandaId) {
        return musicaRepository.findByBandaId(bandaId);
    }

    public Musica saveSong(Musica musica) {
        return musicaRepository.save(musica);
    }

    public void deleteSong(Long id) {
        musicaRepository.deleteById(id);
    }

    // 🔹 Check if a song exists by ID
    public boolean songExists(Long id) {
        return musicaRepository.existsById(id);
    }

    public List<Musica> getLastAddedSongs(int limit) {
        return musicaRepository.findLastAddedSongs(PageRequest.of(0, limit));
    }

    public Banda findOrCreateBand(String nome) {
        List<Banda> bandas = bandaRepository.findByNomeContainingIgnoreCase(nome);

        if (!bandas.isEmpty()) {
            return bandas.get(0);
        }

        Banda b = new Banda();
        b.setNome(nome);
        return bandaRepository.save(b);
    }

    public java.util.Optional<Banda> getBandById(Long id) {
        return bandaRepository.findById(id);
    }

    public java.util.Optional<Album> getAlbumById(Long id) {
        return albumRepository.findById(id);
    }


    public Album findOrCreateAlbum(String nome, Banda banda) {

        if (nome == null || nome.isBlank()) {
            return null; // música sem álbum
        }

        List<Album> albuns = albumRepository.findByNomeContainingIgnoreCase(nome);

        if (!albuns.isEmpty()) {
            return albuns.get(0); // pega o primeiro encontrado
        }

        Album a = new Album();
        a.setNome(nome);
        a.setBanda(banda);
        return albumRepository.save(a);
    }
}
