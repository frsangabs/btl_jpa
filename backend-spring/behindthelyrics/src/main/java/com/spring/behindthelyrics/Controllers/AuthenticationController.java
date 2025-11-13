package com.spring.behindthelyrics.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.behindthelyrics.Controllers.model.user.AuthenticationDTO;
import com.spring.behindthelyrics.Controllers.model.user.LoginResponseDTO;
import com.spring.behindthelyrics.Controllers.model.user.RegisterDTO;
import com.spring.behindthelyrics.Controllers.model.user.Usuario;
import com.spring.behindthelyrics.Controllers.model.user.UsuarioRepository;
import com.spring.behindthelyrics.config.TokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired 
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth  = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Usuario)auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDTO data){
        if(this.repository.findByUsername(data.username()) != null) return ResponseEntity.badRequest()
        .body("Erro: usuário já existe!");

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());

        Usuario newUser = new Usuario(data.username(), encryptedPassword, data.role());

        this.repository.save(newUser);

        return ResponseEntity.ok("Usuário cadastrado com sucesso.");
        
    }

}
