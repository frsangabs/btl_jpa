package com.spring.behindthelyrics.Controllers.model.user;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // 🔹 Create new user
    public Usuario createUser(Usuario user) {
        if (usuarioRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username já existe.");
        }
        if (usuarioRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já registrado.");
        }
        return usuarioRepository.save(user);
    }

    // 🔹 Get user by ID
    public Optional<Usuario> getUserById(Long id) {
        return usuarioRepository.findById(id);
    }

    // 🔹 Get all users
    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }

    // 🔹 Get user by username
    public UserDetails getUserByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // 🔹 Update user data
    public Usuario updateUser(Long id, Usuario newData) {
        Usuario user = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        user.setUsername(newData.getUsername());
        user.setEmail(newData.getEmail());
        user.setPassword(newData.getPassword());

        return usuarioRepository.save(user);
    }

    // 🔹 Delete user
    public void deleteUser(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado.");
        }
        usuarioRepository.deleteById(id);
    }
}
