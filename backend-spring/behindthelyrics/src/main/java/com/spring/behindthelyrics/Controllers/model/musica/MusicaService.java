package com.spring.behindthelyrics.Controllers.model.musica;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MusicaService {

    private final MusicaRepository musicaRepository;

    public MusicaService(MusicaRepository musicaRepository) {
        this.musicaRepository = musicaRepository;
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
}
