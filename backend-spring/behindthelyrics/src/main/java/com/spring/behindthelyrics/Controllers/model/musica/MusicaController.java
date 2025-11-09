package com.spring.behindthelyrics.Controllers.model.musica;

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
@RequestMapping("/musicas")
public class MusicaController {

    private final MusicaService musicaService;

    public MusicaController(MusicaService musicaService) {
        this.musicaService = musicaService;
    }

    // DTO simples (para listagem)
    public static record MusicaDTO(Long id, String nome, String bandaNome) {}

    // DTO para comentários
    public static record ComentarioDTO(String usuario, String texto, LocalDateTime data) {}

    // DTO detalhado (para visualização completa)
    public static record MusicaDetalhesDTO(
        Long id,
        String nome,
        String lore,
        String bandaNome,
        String albumNome,
        List<ComentarioDTO> comentarios
    ) {}

    // 🔹 GET: retorna todas as músicas (id, nome e nome da banda)
    @GetMapping
    public ResponseEntity<List<MusicaDTO>> getAllMusicas() {
        List<MusicaDTO> musicas = musicaService.getAllSongs().stream()
            .map(m -> new MusicaDTO(
                m.getId(),
                m.getNome(),
                m.getBanda() != null ? m.getBanda().getNome() : null
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(musicas);
    }

    // 🔹 GET: retorna detalhes de uma música pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<MusicaDetalhesDTO> getMusicaById(@PathVariable Long id) {
        Optional<Musica> musicaOpt = musicaService.getSongById(id);

        if (musicaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Musica musica = musicaOpt.get();

        List<ComentarioDTO> comentariosDTO = musica.getComentarios() != null
            ? musica.getComentarios().stream()
                .map(c -> new ComentarioDTO(
                    c.getUsuario().getUsername(),
                    c.getTexto(),
                    c.getDataCriacao()
                ))
                .collect(Collectors.toList())
            : List.of();

        MusicaDetalhesDTO detalhes = new MusicaDetalhesDTO(
            musica.getId(),
            musica.getNome(),
            musica.getLore(),
            musica.getBanda() != null ? musica.getBanda().getNome() : null,
            musica.getAlbum() != null ? musica.getAlbum().getNome() : null,
            comentariosDTO
        );

        return ResponseEntity.ok(detalhes);
    }

    // 🔹 POST: cria uma nova música
    @PostMapping
    public ResponseEntity<Musica> createMusica(@RequestBody Musica novaMusica) {
        Musica salva = musicaService.saveSong(novaMusica);
        return ResponseEntity.ok(salva);
    }

    // 🔹 PUT: atualiza uma música existente
    @PutMapping("/{id}")
    public ResponseEntity<Musica> updateMusica(@PathVariable Long id, @RequestBody Musica dadosAtualizados) {
        Optional<Musica> musicaOpt = musicaService.getSongById(id);

        if (musicaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Musica existente = musicaOpt.get();

        existente.setNome(dadosAtualizados.getNome());
        existente.setLore(dadosAtualizados.getLore());
        existente.setAlbum(dadosAtualizados.getAlbum());
        existente.setBanda(dadosAtualizados.getBanda());

        Musica atualizada = musicaService.saveSong(existente);
        return ResponseEntity.ok(atualizada);
    }

    // 🔹 DELETE: exclui uma música pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMusica(@PathVariable Long id) {
        if (!musicaService.songExists(id)) {
            return ResponseEntity.notFound().build();
        }

        musicaService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}

