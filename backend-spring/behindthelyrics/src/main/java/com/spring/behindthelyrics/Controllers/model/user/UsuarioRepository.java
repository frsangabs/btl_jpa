package com.spring.behindthelyrics.Controllers.model.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    // Verificar se o username já existe
    boolean existsByUsername(String username);

    // Verificar se o e-mail já está cadastrado
    boolean existsByEmail(String email);
}
