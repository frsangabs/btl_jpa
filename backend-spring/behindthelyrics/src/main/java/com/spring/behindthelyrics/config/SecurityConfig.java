package com.spring.behindthelyrics.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
                corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                corsConfig.setAllowedHeaders(java.util.List.of("*"));
                corsConfig.setAllowCredentials(true);

                var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfig);
                return corsConfig;
            }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                                    .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                                    .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                                    .requestMatchers(HttpMethod.GET, "/bands/**").permitAll()
                                    .requestMatchers(HttpMethod.GET, "/albuns/**").permitAll()
                                    .requestMatchers(HttpMethod.GET, "/musicas/**").permitAll()

                                    .requestMatchers(HttpMethod.POST, "/bands").hasAnyAuthority("ROLE_ADMIN")
                                    .requestMatchers(HttpMethod.POST, "/albuns").hasAnyAuthority("ROLE_ADMIN")
                                    .requestMatchers(HttpMethod.POST, "/musicas").hasAnyAuthority("ROLE_ADMIN")

                                    .requestMatchers("/comments/**").authenticated()
                                    
                                    .anyRequest().authenticated())
                                    .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                                    .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        
        return authenticationConfiguration.getAuthenticationManager();

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
