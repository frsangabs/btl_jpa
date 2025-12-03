package com.spring.behindthelyrics.Controllers;

import java.util.ArrayList;
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

        // 🔹 Monta o JSON de resposta — convertendo para mapas simples (DTO-like)
        if (topBand != null) {
            Map<String, Object> bandMap = new HashMap<>();
            bandMap.put("id", topBand.getId());
            bandMap.put("nome", topBand.getNome());
            response.put("topBand", bandMap);
        } else {
            response.put("topBand", null);
        }

        if (topAlbum != null) {
            Map<String, Object> albumMap = new HashMap<>();
            albumMap.put("id", topAlbum.getId());
            albumMap.put("nome", topAlbum.getNome());
            albumMap.put("banda", topAlbum.getBanda() != null ? topAlbum.getBanda().getNome() : null);
            response.put("topAlbum", albumMap);
        } else {
            response.put("topAlbum", null);
        }

        if (topMusic != null) {
            Map<String, Object> musicMap = new HashMap<>();
            musicMap.put("id", topMusic.getId());
            musicMap.put("nome", topMusic.getNome());
            musicMap.put("banda", topMusic.getBanda() != null ? topMusic.getBanda().getNome() : null);
            response.put("topMusic", musicMap);
        } else {
            response.put("topMusic", null);
        }

        List<Map<String, Object>> latestSongMaps = new ArrayList<>();
        if (latestSongs != null) {
            for (Musica m : latestSongs) {
                Map<String, Object> mMap = new HashMap<>();
                mMap.put("id", m.getId());
                mMap.put("nome", m.getNome());
                mMap.put("banda", m.getBanda() != null ? m.getBanda().getNome() : null);
                latestSongMaps.add(mMap);
            }
        }
        response.put("latestSongs", latestSongMaps);

        return response;
    }
}
