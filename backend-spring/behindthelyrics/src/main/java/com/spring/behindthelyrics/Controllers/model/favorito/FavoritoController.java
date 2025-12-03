package com.spring.behindthelyrics.Controllers.model.favorito;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.behindthelyrics.Controllers.model.user.Usuario;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    //  LISTAR TODOS DO USUÁRIO

    @GetMapping
    public ResponseEntity<?> listarFavoritos(@AuthenticationPrincipal Usuario usuario) {
        List<Favorito> favoritos = favoritoService.getFavoritesByUser(usuario.getId());

        List<FavoritoDTO> bandas = new ArrayList<>();
        List<FavoritoDTO> albuns = new ArrayList<>();
        List<FavoritoDTO> musicas = new ArrayList<>();

        for (Favorito f : favoritos) {
            if (f.getBanda() != null) {
                bandas.add(new FavoritoDTO(
                        f.getBanda().getId(),
                        f.getBanda().getNome(),
                        "banda"
                ));
            }

            if (f.getAlbum() != null) {
                albuns.add(new FavoritoDTO(
                        f.getAlbum().getId(),
                        f.getAlbum().getNome(),
                        "album"
                ));
            }

            if (f.getMusica() != null) {
                musicas.add(new FavoritoDTO(
                        f.getMusica().getId(),
                        f.getMusica().getNome(),
                        "musica"
                ));
            }
        }

        Map<String, List<?>> response = new HashMap<>();
        response.put("bandas", bandas);
        response.put("albuns", albuns);
        response.put("musicas", musicas);

        return ResponseEntity.ok(response);
    }

    //  BANDA

    @PostMapping("/bands/{bandaId}")
    public ResponseEntity<?> favoritarBanda(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long bandaId) {

        favoritoService.favoritarBanda(usuario.getId(), bandaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bands/{bandaId}")
    public ResponseEntity<?> desfavoritarBanda(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long bandaId) {

        favoritoService.desfavoritarBanda(usuario.getId(), bandaId);
        return ResponseEntity.ok().build();
    }

    //  ÁLBUM

    @PostMapping("/albuns/{albumId}")
    public ResponseEntity<?> favoritarAlbum(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long albumId) {

        favoritoService.favoritarAlbum(usuario.getId(), albumId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/albuns/{albumId}")
    public ResponseEntity<?> desfavoritarAlbum(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long albumId){

        favoritoService.desfavoritarAlbum(usuario.getId(), albumId);
        return ResponseEntity.ok().build();
    }

    //  MÚSICA

    @PostMapping("/musicas/{musicaId}")
    public ResponseEntity<?> favoritarMusica(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long musicaId) {

        favoritoService.favoritarMusica(usuario.getId(), musicaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/musicas/{musicaId}")
    public ResponseEntity<?> desfavoritarMusica(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long musicaId) {

        favoritoService.desfavoritarMusica(usuario.getId(), musicaId);
        return ResponseEntity.ok().build();
    }
}
