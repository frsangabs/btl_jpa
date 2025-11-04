package com.spring.behindthelyrics.Controllers.model.album;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    // 🔹 Get all albums (sorted A–Z)
    public List<Album> getAllAlbums() {
        return albumRepository.findAll(Sort.by("nome").ascending());
    }

    public Optional<Album> getAlbumById(Long id) {
        return albumRepository.findById(id);
    }

    // 🔹 Get album with full details (musics, comments, favorites)
    public Optional<Album> getAlbumWithAllDetails(Long id) {
        return albumRepository.findByIdWithAllRelations(id);
    }

    // 🔹 Search albums by partial name
    public List<Album> searchAlbumsByName(String name) {
        return albumRepository.findByNomeContainingIgnoreCase(name);
    }

    public List<Album> getAlbumsByBand(Long bandaId) {
        return albumRepository.findByBandaId(bandaId);
    }

    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }

    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }

    // 🔹 Check if album exists by ID
    public boolean albumExists(Long id) {
        return albumRepository.existsById(id);
    }
}
