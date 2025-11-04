package com.spring.behindthelyrics.Controllers.model.banda;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BandaService {

    private final BandaRepository bandaRepository;

    public BandaService(BandaRepository bandaRepository) {
        this.bandaRepository = bandaRepository;
    }

    // 🔹 Get all bands (sorted A–Z)
    public List<Banda> getAllBands() {
        return bandaRepository.findAll(Sort.by("nome").ascending());
    }

    public Optional<Banda> getBandById(Long id) {
        return bandaRepository.findById(id);
    }


    // 🔹 Search bands by partial name (for dynamic filters)
    public List<Banda> searchBandsByName(String name) {
        return bandaRepository.findByNameContainingIgnoreCase(name);
    }

    public Banda saveBand(Banda banda) {
        return bandaRepository.save(banda);
    }

    public void deleteBand(Long id) {
        bandaRepository.deleteById(id);
    }

    // 🔹 Check if a band exists by ID
    public boolean bandExists(Long id) {
        return bandaRepository.existsById(id);
    }

    public Optional<Banda> getBandWithAllDetails(Long id) {
        return bandaRepository.findByIdWithAllRelations(id);
    }

}