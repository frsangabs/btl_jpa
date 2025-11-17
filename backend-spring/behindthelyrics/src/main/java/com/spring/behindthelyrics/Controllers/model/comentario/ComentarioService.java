package com.spring.behindthelyrics.Controllers.model.comentario;

import java.util.List;

import org.springframework.stereotype.Service;

import com.spring.behindthelyrics.Controllers.model.user.Usuario;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;

    public ComentarioService(ComentarioRepository comentarioRepository) {
        this.comentarioRepository = comentarioRepository;
    }

    // 🔹 Criar novo comentário
    public Comentario createComment(Comentario comment) {
        return comentarioRepository.save(comment);
    }

    // 🔹 Listar comentários de uma música específica
    public List<Comentario> getCommentsByMusic(Long musicId) {
        return comentarioRepository.findByMusicaId(musicId);
    }

    // 🔹 Listar comentários de um álbum específico
    public List<Comentario> getCommentsByAlbum(Long albumId) {
        return comentarioRepository.findByAlbumId(albumId);
    }

    // 🔹 Listar comentários de uma banda específica
    public List<Comentario> getCommentsByBand(Long bandId) {
        return comentarioRepository.findByBandaId(bandId);
    }

    // 🔹 Listar comentários de um usuário específico
    public List<Comentario> getCommentsByUser(Long userId) {
        return comentarioRepository.findByUsuarioId(userId);
    }

    public void deleteComment(Long id, Usuario usuarioAutenticado) {

        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado."));

        boolean isAuthor = comentario.getUsuario().getId().equals(usuarioAutenticado.getId());
        boolean isAdmin = usuarioAutenticado.getRole().getRole().equals("admin");

        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Você não tem permissão para deletar este comentário.");
        }

        comentarioRepository.deleteById(id);
    }
}