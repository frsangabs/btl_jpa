package com.spring.behindthelyrics.Controllers.model.favorito;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;
import com.spring.behindthelyrics.Controllers.model.user.Usuario;

import jakarta.transaction.Transactional;

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

    // 🔹 Banda mais favoritada
    public Optional<Banda> getMostFavoritedBand() {
        List<Banda> result = favoritoRepository.findTopFavoritedBand(PageRequest.of(0, 1));
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    // 🔹 Álbum mais favoritado
    public Optional<Album> getMostFavoritedAlbum() {
        List<Album> result = favoritoRepository.findTopFavoritedAlbum(PageRequest.of(0, 1));
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    // 🔹 Música mais favoritada
    public Optional<Musica> getMostFavoritedMusic() {
        List<Musica> result = favoritoRepository.findTopFavoritedMusic(PageRequest.of(0, 1));
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }
    
    public boolean isBandaFavorita(Long usuarioId, Long bandaId) {
    return favoritoRepository.existsByUsuarioIdAndBandaId(usuarioId, bandaId);
    }

    public void favoritarBanda(Long usuarioId, Long bandaId) {
        if (!isBandaFavorita(usuarioId, bandaId)) {
            Favorito f = new Favorito();
            f.setUsuario(new Usuario(usuarioId));
            f.setBanda(new Banda(bandaId));
            favoritoRepository.save(f);
        }
    }


    @Transactional
    public void desfavoritarBanda(Long usuarioId, Long bandaId) {
        favoritoRepository.deleteByUsuarioIdAndBandaId(usuarioId, bandaId);
    }


    // ====== ÁLBUM ======

    public boolean isAlbumFavorito(Long usuarioId, Long albumId) {
        return favoritoRepository.existsByUsuarioIdAndAlbumId(usuarioId, albumId);
    }

    public void favoritarAlbum(Long usuarioId, Long albumId) {
        if (!isAlbumFavorito(usuarioId, albumId)) {
            Favorito f = new Favorito();
            f.setUsuario(new Usuario(usuarioId));
            f.setAlbum(new Album(albumId));
            favoritoRepository.save(f);
        }
    }

    @Transactional
    public void desfavoritarAlbum(Long usuarioId, Long albumId) {
        favoritoRepository.deleteByUsuarioIdAndAlbumId(usuarioId, albumId);
    }


    // ====== MÚSICA ======

    public boolean isMusicaFavorita(Long usuarioId, Long musicaId) {
        return favoritoRepository.existsByUsuarioIdAndMusicaId(usuarioId, musicaId);
    }

    public void favoritarMusica(Long usuarioId, Long musicaId) {
        if (!isMusicaFavorita(usuarioId, musicaId)) {
            Favorito f = new Favorito();
            f.setUsuario(new Usuario(usuarioId));
            f.setMusica(new Musica(musicaId));
            favoritoRepository.save(f);
        }
    }

    @Transactional
    public void desfavoritarMusica(Long usuarioId, Long musicaId) {
        favoritoRepository.deleteByUsuarioIdAndMusicaId(usuarioId, musicaId);
    }

}
