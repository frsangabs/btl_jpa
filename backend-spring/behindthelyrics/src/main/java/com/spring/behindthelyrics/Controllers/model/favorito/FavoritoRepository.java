package com.spring.behindthelyrics.Controllers.model.favorito;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    // 🔹 Buscar favoritos por ID de usuário
    List<Favorito> findByUsuarioId(Long usuarioId);

    // 🔹 Buscar favoritos por ID de música
    List<Favorito> findByMusicaId(Long musicaId);

    // 🔹 Buscar favoritos por ID de álbum
    List<Favorito> findByAlbumId(Long albumId);

    // 🔹 Buscar favoritos por ID de banda
    List<Favorito> findByBandaId(Long bandaId);

    // 🔹 Banda mais favoritada
    @Query("""
        SELECT f.banda 
        FROM Favorito f 
        WHERE f.banda IS NOT NULL 
        GROUP BY f.banda 
        ORDER BY COUNT(f.banda) DESC
    """)
    java.util.List<Banda> findTopFavoritedBand(Pageable pageable);

    // 🔹 Álbum mais favoritado
    @Query("""
        SELECT f.album 
        FROM Favorito f 
        WHERE f.album IS NOT NULL 
        GROUP BY f.album 
        ORDER BY COUNT(f.album) DESC
    """)
    java.util.List<Album> findTopFavoritedAlbum(Pageable pageable);

    // 🔹 Música mais favoritada
    @Query("""
        SELECT f.musica 
        FROM Favorito f 
        WHERE f.musica IS NOT NULL 
        GROUP BY f.musica 
        ORDER BY COUNT(f.musica) DESC
    """)
    java.util.List<Musica> findTopFavoritedMusic(Pageable pageable);

    @Query("SELECT f.banda.id FROM Favorito f WHERE f.usuario.id = :usuarioId AND f.banda IS NOT NULL")
    List<Long> findBandaIdsFavoritasByUsuario(@Param("usuarioId") Long usuarioId);

    boolean existsByUsuarioIdAndBandaId(Long usuarioId, Long bandaId);
    boolean existsByUsuarioIdAndAlbumId(Long usuarioId, Long albumId);
    boolean existsByUsuarioIdAndMusicaId(Long usuarioId, Long musicaId);

    void deleteByUsuarioIdAndBandaId(Long usuarioId, Long bandaId);
    void deleteByUsuarioIdAndAlbumId(Long usuarioId, Long albumId);
    void deleteByUsuarioIdAndMusicaId(Long usuarioId, Long musicaId);


}
