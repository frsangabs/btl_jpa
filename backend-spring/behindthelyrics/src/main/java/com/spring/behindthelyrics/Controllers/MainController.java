package com.spring.behindthelyrics.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.favorito.FavoritoService;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;
import com.spring.behindthelyrics.Controllers.model.musica.MusicaService;

@RestController
public class MainController {

    private final FavoritoService favoritoService;
    private final MusicaService musicaService;

    public MainController(FavoritoService favoritoService, MusicaService musicaService) {
        this.favoritoService = favoritoService;
        this.musicaService = musicaService;
    }

    @GetMapping("/home")
    public Map<String, Object> getHomeData() {
        Map<String, Object> response = new HashMap<>();

        // 🔹 Banda mais favoritada
        Banda topBand = favoritoService.getMostFavoritedBand().orElse(null);

        // 🔹 Álbum mais favoritado
        Album topAlbum = favoritoService.getMostFavoritedAlbum().orElse(null);

        // 🔹 Música mais favoritada
        Musica topMusic = favoritoService.getMostFavoritedMusic().orElse(null);

        // 🔹 10 últimas músicas adicionadas
        List<Musica> latestSongs = musicaService.getLastAddedSongs(10);

        // 🔹 Monta o JSON de resposta
        response.put("topBand", topBand);
        response.put("topAlbum", topAlbum);
        response.put("topMusic", topMusic);
        response.put("latestSongs", latestSongs);

        return response;
    }
}
