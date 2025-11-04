package com.spring.behindthelyrics.Controllers.model.favorito;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;

    public FavoritoService(FavoritoRepository favoritoRepository) {
        this.favoritoRepository = favoritoRepository;
    }

    // 🔹 Criar novo favorito
    public Favorito createFavorite(Favorito favorite) {
        return favoritoRepository.save(favorite);
    }

    // 🔹 Listar favoritos de um usuário específico
    public List<Favorito> getFavoritesByUser(Long userId) {
        return favoritoRepository.findByUsuarioId(userId);
    }

    // 🔹 Listar favoritos de uma música específica
    public List<Favorito> getFavoritesByMusic(Long musicId) {
        return favoritoRepository.findByMusicaId(musicId);
    }

    // 🔹 Listar favoritos de um álbum específico
    public List<Favorito> getFavoritesByAlbum(Long albumId) {
        return favoritoRepository.findByAlbumId(albumId);
    }

    // 🔹 Listar favoritos de uma banda específica
    public List<Favorito> getFavoritesByBand(Long bandId) {
        return favoritoRepository.findByBandaId(bandId);
    }

    // 🔹 Excluir favorito
    public void deleteFavorite(Long id) {
        if (!favoritoRepository.existsById(id)) {
            throw new RuntimeException("Favorito não encontrado.");
        }
        favoritoRepository.deleteById(id);
    }
}
