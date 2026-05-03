# 🎵 Behind The Lyrics

Plataforma web para explorar **bandas, álbuns e músicas**, com autenticação via JWT e recursos de comentários e favoritos.

## 📌 Status do projeto

Projeto em evolução com base funcional de backend + frontend:

- ✅ Autenticação (`/auth/login`, `/auth/register`).
- ✅ Rotas públicas de consulta para bandas, álbuns e músicas.
- ✅ Controle de autorização por perfil (`ROLE_USER` e `ROLE_ADMIN`).
- ✅ Estrutura de favoritos e comentários com persistência relacional.
- ✅ Migrações de banco com Flyway.

## 🧱 Stack

### Backend
- Java **21**
- Spring Boot **3.5.x**
- Spring Data JPA / Hibernate
- Spring Security + JWT (`java-jwt`)
- Flyway
- PostgreSQL

### Frontend
- React 19 (Create React App)
- React Router
- JavaScript + CSS

## 🗂️ Estrutura do repositório

```text
.
├── backend-spring/behindthelyrics   # API Spring Boot
└── frontend                         # Aplicação React
```

## 🚀 Como executar

## 1) Backend

### Pré-requisitos
- Java 21
- Maven (ou usar `./mvnw`)
- PostgreSQL em execução

### Variáveis / propriedades importantes
A aplicação usa propriedades com fallback para desenvolvimento local. Configure por variável de ambiente ou por arquivo de propriedades:

- `API_SECURITY_TOKEN_SECRET` (obrigatória em produção)
- `APP_CORS_ALLOWED_ORIGINS` (opcional, padrão: `http://localhost:3000`)
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Exemplo de execução local:

```bash
cd backend-spring/behindthelyrics
API_SECURITY_TOKEN_SECRET=minha-chave-local \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/behindthelyrics \
SPRING_DATASOURCE_USERNAME=postgres \
SPRING_DATASOURCE_PASSWORD=postgres \
./mvnw spring-boot:run
```

## 2) Frontend

```bash
cd frontend
npm install
npm start
```

A aplicação iniciará em `http://localhost:3000`.

## 🔐 Regras de acesso (resumo)

- **Público**: login/registro e GETs de catálogo (`/bands/**`, `/albuns/**`, `/musicas/**`, `/search/**`, `/home`).
- **ADMIN**: criação de bandas/álbuns/músicas (POST).
- **USER e ADMIN**: gestão de favoritos.
- **Autenticado**: endpoints de comentários.

## 🛠️ Melhorias recentes

- Padronização de criptografia de senha com `PasswordEncoder` injetado.
- Expiração de token baseada em UTC (`Instant.now()`), reduzindo inconsistências de timezone.
- CORS configurável por propriedade (`app.cors.allowed-origins`).
- Tratamento de erros HTTP no frontend para falhas não-401.

## 📈 Próximos passos sugeridos

- Ampliar cobertura de testes (service/controller).
- Adicionar CI para lint e testes.
- Publicar documentação de endpoints (OpenAPI/Swagger).
