package com.spring.behindthelyrics.Controllers.model.user;

public enum UsuarioRole {
    ROLE_ADMIN("admin"), 
    ROLE_USER("user");

    // 2. Declaração do campo
    private final String role; 

    // 3. Construtor privado (implícito ou explícito)
    //    Ele recebe o argumento que você passa para as constantes acima.
    UsuarioRole(String role) { 
        this.role = role;
    }

    // 4. Getter para acessar o valor (opcional, mas útil)
    public String getRole() {
        return role;
    }
}
