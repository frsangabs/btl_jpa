package com.spring.behindthelyrics.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.behindthelyrics.Controllers.model.album.AlbumService;
import com.spring.behindthelyrics.Controllers.model.banda.BandaService;
import com.spring.behindthelyrics.Controllers.model.musica.MusicaService;


@RestController
@RequestMapping("/search")
public class BuscaController {

    private final BandaService bandaService;
    private final AlbumService albumService;
    private final MusicaService musicaService;

    public BuscaController(BandaService bandaService, AlbumService albumService, MusicaService musicaService) {
        this.bandaService = bandaService;
        this.albumService = albumService;
        this.musicaService = musicaService;
    }

    @GetMapping
    public Map<String, Object> globalSearch(@RequestParam String query) {
        Map<String, Object> result = new HashMap<>();

        result.put("bands", bandaService.searchBandsByName(query));
        result.put("albums", albumService.searchAlbumsByName(query));
        result.put("songs", musicaService.searchSongsByName(query));

        return result;
    }

}
