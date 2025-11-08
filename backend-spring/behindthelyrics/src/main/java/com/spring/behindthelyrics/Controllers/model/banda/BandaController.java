package com.spring.behindthelyrics.Controllers.model.banda;

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
@RequestMapping("/bands")
public class BandaController {

    private final BandaService bandaService;

    public BandaController(BandaService bandaService) {
        this.bandaService = bandaService;
    }

    // DTO interno
    public static record BandaDTO(Long id, String nome) {}
    public static record AlbumResumoDTO(Long id, String nome) {}
    public static record MusicaResumoDTO(Long id, String nome) {}
    public static record ComentarioDTO(String usuario, String texto, LocalDateTime data) {}

    public static record BandaDetalhesDTO(
    Long id,
    String nome,
    String lore,
    List<AlbumResumoDTO> albuns,
    List<MusicaResumoDTO> musicas,
    List<ComentarioDTO> comentarios
) {}

    // 🔹 GET: retorna todas as bandas (somente id e nome)
    @GetMapping
    public ResponseEntity<List<BandaDTO>> getAllBands() {
        List<BandaDTO> bandas = bandaService.getAllBands().stream()
                .map(b -> new BandaDTO(b.getId(), b.getNome()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(bandas); // ← 200 OK se deu tudo certo
    }

    // 🔹 GET: retorna os detalhes de uma banda pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<BandaDetalhesDTO> getBandById(@PathVariable Long id) {
        return bandaService.getBandById(id)
            .map(b -> {
                List<AlbumResumoDTO> albuns = b.getAlbuns().stream()
                    .map(a -> new AlbumResumoDTO(a.getId(), a.getNome()))
                    .toList();

                List<MusicaResumoDTO> musicas = b.getMusicas().stream()
                    .map(m -> new MusicaResumoDTO(m.getId(), m.getNome()))
                    .toList();

                List<ComentarioDTO> comentariosDTO = b.getComentarios().stream()
                    .map(c -> new ComentarioDTO(
                        c.getUsuario().getUsername(),  // só pega o username
                        c.getTexto(),
                        c.getDataCriacao()
                    ))
                    .toList();

                return new BandaDetalhesDTO(
                    b.getId(),
                    b.getNome(),
                    b.getLore(),
                    albuns,
                    musicas,
                    comentariosDTO
                );
            })
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🔹 CREATE - Criar nova banda
    @PostMapping
    public ResponseEntity<Banda> createBanda(@RequestBody Banda novaBanda) {
        Banda salva = bandaService.saveBand(novaBanda);
        return ResponseEntity.ok(salva);
    }

    // 🔹 UPDATE - Editar banda
    @PutMapping("/{id}")
    public ResponseEntity<Banda> editBanda(@PathVariable Long id, @RequestBody Banda dadosAtualizados) {
        Optional<Banda> bandaOpt = bandaService.getBandById(id);

        if (bandaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Banda bandaExistente = bandaOpt.get();

        // Atualiza os campos
        bandaExistente.setNome(dadosAtualizados.getNome());
        bandaExistente.setLore(dadosAtualizados.getLore());

        Banda bandaAtualizada = bandaService.saveBand(bandaExistente);

        return ResponseEntity.ok(bandaAtualizada);
    }

    // ==========================
    // 🔹 DELETE - Excluir banda
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanda(@PathVariable Long id) {
        if (!bandaService.bandExists(id)) {
            return ResponseEntity.notFound().build();
        }

        bandaService.deleteBand(id);
        return ResponseEntity.noContent().build();
    }
}