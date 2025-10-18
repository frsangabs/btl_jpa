package com.spring.behindthelyrics.Controllers.model.banda;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BandaService {

    @Autowired
    private BandaRepository bandaRepository;

    public Banda adicionarBanda(Banda banda) {
        return bandaRepository.save(banda);
    }

    public List<Banda> puxarTodasBandas() {
        return bandaRepository.findAll();
    }

    public Optional<Banda> puxarBanda(int id) {
        return bandaRepository.findById(id);
    }

    public List<Banda> puxarTop3Bandas() {
        return bandaRepository.findTop3Bandas();
    }

    public void deletar(int id) {
        bandaRepository.deleteById(id);
    }

    public Banda atualizarBanda(int id, Banda dados) {
        return bandaRepository.findById(id).map(b -> {
            b.setNome(dados.getNome());
            b.setLore(dados.getLore());
            return bandaRepository.save(b);
        }).orElseThrow(() -> new RuntimeException("Banda não encontrada"));
    }
}