package com.spring.behindthelyrics.Controllers.model.comentario;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.behindthelyrics.Controllers.model.album.Album;
import com.spring.behindthelyrics.Controllers.model.album.AlbumRepository;
import com.spring.behindthelyrics.Controllers.model.banda.Banda;
import com.spring.behindthelyrics.Controllers.model.banda.BandaRepository;
import com.spring.behindthelyrics.Controllers.model.musica.Musica;
import com.spring.behindthelyrics.Controllers.model.musica.MusicaRepository;
import com.spring.behindthelyrics.Controllers.model.user.Usuario;

@RestController
@RequestMapping("/comments")
public class ComentarioController {

    private final ComentarioService comentarioService;
    private final BandaRepository bandaRepository;
    private final AlbumRepository albumRepository;
    private final MusicaRepository musicaRepository;

    public ComentarioController(
        ComentarioService comentarioService,
        BandaRepository bandaRepository,
        AlbumRepository albumRepository,
        MusicaRepository musicaRepository
    ) {
        this.comentarioService = comentarioService;
        this.bandaRepository = bandaRepository;
        this.albumRepository = albumRepository;
        this.musicaRepository = musicaRepository;
    }

    // DTO simples
    public static record ComentarioDTO(
        Long id,
        String texto,
        LocalDateTime dataCriacao,
        String usuario
    ) {}

    // DTO para criação
    public static record ComentarioCreateDTO(
        String texto
    ) {}


    // ---------------------------------------------------
    // CREATE COMMENT (BANDA)
    // ---------------------------------------------------
    @PostMapping("/bands/{bandaId}")
    public ResponseEntity<?> createCommentForBand(
            @PathVariable Long bandaId,
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody ComentarioCreateDTO dto) {

        Banda banda = bandaRepository.findById(bandaId).orElse(null);

        if (banda == null) {
            return ResponseEntity.badRequest().body("Banda não existe");
        }

        Comentario comment = new Comentario(
            dto.texto(),
            usuarioLogado,
            banda,
            null,
            null
        );

        return ResponseEntity.ok(comentarioService.createComment(comment));
    }


    // ---------------------------------------------------
    // CREATE COMMENT (ÁLBUM)
    // ---------------------------------------------------
    @PostMapping("/albuns/{albumId}")
    public ResponseEntity<?> createCommentForAlbum(
            @PathVariable Long albumId,
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody ComentarioCreateDTO dto) {

        Album album = albumRepository.findById(albumId).orElse(null);

        if (album == null) {
            return ResponseEntity.badRequest().body("Álbum não existe");
        }

        Comentario comment = new Comentario(
            dto.texto(),
            usuarioLogado,
            null,
            album,
            null
        );

        return ResponseEntity.ok(comentarioService.createComment(comment));
    }


    // ---------------------------------------------------
    // CREATE COMMENT (MÚSICA)
    // ---------------------------------------------------
    @PostMapping("/musicas/{musicaId}")
    public ResponseEntity<?> createCommentForMusic(
            @PathVariable Long musicaId,
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody ComentarioCreateDTO dto) {

        Musica musica = musicaRepository.findById(musicaId).orElse(null);

        if (musica == null) {
            return ResponseEntity.badRequest().body("Música não existe");
        }

        Comentario comment = new Comentario(
            dto.texto(),
            usuarioLogado,
            null,
            null,
            musica
        );

        return ResponseEntity.ok(comentarioService.createComment(comment));
    }


    // GET COMMENTS (BANDA)
    @GetMapping("/bands/{bandaId}")
    public ResponseEntity<List<ComentarioDTO>> getCommentsForBand(@PathVariable Long bandaId) {
        return ResponseEntity.ok(
            comentarioService.getCommentsByBand(bandaId).stream()
                .map(c -> new ComentarioDTO(
                    c.getId(),
                    c.getTexto(),
                    c.getDataCriacao(),
                    c.getUsuario().getUsername()
                ))
                .toList()
        );
    }

    // GET COMMENTS (ÁLBUM)
    @GetMapping("/albuns/{albumId}")
    public ResponseEntity<List<ComentarioDTO>> getCommentsForAlbum(@PathVariable Long albumId) {
        return ResponseEntity.ok(
            comentarioService.getCommentsByAlbum(albumId).stream()
                .map(c -> new ComentarioDTO(
                    c.getId(),
                    c.getTexto(),
                    c.getDataCriacao(),
                    c.getUsuario().getUsername()
                ))
                .toList()
        );
    }

    // GET COMMENTS (MÚSICA)
    @GetMapping("/musicas/{musicaId}")
    public ResponseEntity<List<ComentarioDTO>> getCommentsForMusic(@PathVariable Long musicaId) {
        return ResponseEntity.ok(
            comentarioService.getCommentsByMusic(musicaId).stream()
                .map(c -> new ComentarioDTO(
                    c.getId(),
                    c.getTexto(),
                    c.getDataCriacao(),
                    c.getUsuario().getUsername()
                ))
                .toList()
        );
    }

    // GET COMMENTS BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ComentarioDTO>> getCommentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
            comentarioService.getCommentsByUser(userId).stream()
                .map(c -> new ComentarioDTO(
                    c.getId(),
                    c.getTexto(),
                    c.getDataCriacao(),
                    c.getUsuario().getUsername()
                ))
                .toList()
        );
    }

    // DELETE COMMENT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        comentarioService.deleteComment(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}
