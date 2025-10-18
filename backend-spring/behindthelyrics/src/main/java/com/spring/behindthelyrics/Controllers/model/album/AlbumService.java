package com.spring.behindthelyrics.Controllers.model.album;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public Album adicionarAlbum(Album album) {
        return albumRepository.save(album);
    }

    public List<Album> puxarTodosAlbuns() {
        return albumRepository.findAll();
    }

    public Album puxarAlbum(int id) {
        return albumRepository.findById(id).orElse(null);
    }

    public List<Album> puxarAlbunsPorBanda(int bandaId) {
        return albumRepository.findByBanda_Id(bandaId);
    }

    public Album atualizarAlbum(int id, Album dadosAtualizados) {
        return albumRepository.findById(id).map(album -> {
            album.setNome(dadosAtualizados.getNome());
            album.setAno_lancamento(dadosAtualizados.getAno_lancamento());
            album.setBanda(dadosAtualizados.getBanda());
            return albumRepository.save(album);
        }).orElse(null);
    }

    public void deletar(int id) {
        albumRepository.deleteById(id);
    }
}