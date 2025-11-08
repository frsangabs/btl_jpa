package com.spring.behindthelyrics.Controllers.model.album;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/albums")
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    // DTO simples (para listagem)
    public static record AlbumDTO(Long id, String nome, String bandaNome) {}
    public static record MusicaResumoDTO(Long id, String nome) {}
    public static record ComentarioDTO(String usuario, String texto, LocalDateTime data) {}

    // DTO detalhado (para visualização completa)
    public static record AlbumDetalhesDTO(
        Long id,
        String nome,
        String lore,
        int ano_lancamento,
        String bandaNome,
        List<MusicaResumoDTO> musicas,
        List<ComentarioDTO> comentarios
    ) {}

    // 🔹 GET: retorna todos os álbuns (id, nome e nome da banda)
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        List<AlbumDTO> albuns = albumService.getAllAlbums().stream()
                .map(a -> new AlbumDTO(
                        a.getId(),
                        a.getNome(),
                        a.getBanda() != null ? a.getBanda().getNome() : null
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(albuns);
    }

    // 🔹 GET: retorna detalhes de um álbum pelo ID
    @GetMapping("/{id}")
public ResponseEntity<AlbumDetalhesDTO> getAlbumById(@PathVariable Long id) {
    return albumService.getAlbumById(id)  // busca o álbum normalmente (LAZY)
        .map(a -> {
            // força a inicialização das coleções
            List<MusicaResumoDTO> musicasResumo = a.getMusicas() != null
                    ? a.getMusicas().stream()
                        .map(m -> new MusicaResumoDTO(m.getId(), m.getNome()))
                        .toList()
                    : List.of();

            List<ComentarioDTO> comentariosDTO = a.getComentarios() != null
                    ? a.getComentarios().stream()
                        .map(c -> new ComentarioDTO(
                            c.getUsuario().getUsername(),
                            c.getTexto(),
                            c.getDataCriacao()
                        ))
                        .collect(Collectors.toList())
                    : List.of();

            return new AlbumDetalhesDTO(
                a.getId(),
                a.getNome(),
                a.getLore(),
                a.getAno_lancamento(),
                a.getBanda() != null ? a.getBanda().getNome() : null,
                musicasResumo,
                comentariosDTO
            );
        })
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
}
    // 🔹 POST: cria um novo álbum
    @PostMapping
    public ResponseEntity<Album> createAlbum(@RequestBody Album novoAlbum) {
        Album salvo = albumService.saveAlbum(novoAlbum);
        return ResponseEntity.ok(salvo);
    }

    // 🔹 PUT: atualiza um álbum existente
    @PutMapping("/{id}")
    public ResponseEntity<Album> editAlbum(@PathVariable Long id, @RequestBody Album dadosAtualizados) {
        Optional<Album> albumOpt = albumService.getAlbumById(id);

        if (albumOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Album albumExistente = albumOpt.get();

        albumExistente.setNome(dadosAtualizados.getNome());
        albumExistente.setLore(dadosAtualizados.getLore());
        albumExistente.setAno_lancamento(dadosAtualizados.getAno_lancamento());
        albumExistente.setBanda(dadosAtualizados.getBanda());

        Album atualizado = albumService.saveAlbum(albumExistente);
        return ResponseEntity.ok(atualizado);
    }

    // 🔹 DELETE: exclui um álbum pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        if (!albumService.albumExists(id)) {
            return ResponseEntity.notFound().build();
        }

        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}
