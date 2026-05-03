# Relatório de análise técnica — repositório `btl_jpa`

## 1) Visão geral

O repositório implementa uma aplicação full-stack chamada **Behind The Lyrics**, com:

- **Backend** em Spring Boot (Java 21, JPA, Security, Flyway, JWT).
- **Frontend** em React (CRA) com React Router.
- **Banco** PostgreSQL com migrações versionadas.

A arquitetura está funcional para CRUD e autenticação básica, com uma boa separação inicial entre domínios (banda, álbum, música, comentário, favorito, usuário).

---

## 2) Estrutura observada

### Backend (`backend-spring/behindthelyrics`)

- Estrutura orientada a pacotes por domínio: controllers, services, repositories e entidades.
- Segurança com filtro JWT + regras de autorização por rota/método.
- Migrações Flyway (`V1` a `V4`).

### Frontend (`frontend`)

- Aplicação React com rotas para listagens e detalhes de bandas/álbuns/músicas, além de login.
- Wrapper de API centralizado para anexar token e tratar 401.

---

## 3) Pontos fortes

1. **Stack moderna e coerente**: Spring Boot 3.5.x + Java 21 e React 19.
2. **Segurança básica já presente**:
   - login/register públicos;
   - criação protegida por `ROLE_ADMIN`;
   - endpoints de favoritos restritos a usuário autenticado.
3. **Banco com versionamento** via Flyway.
4. **Organização por domínio** facilita manutenção incremental.

---

## 4) Riscos e pontos de atenção

### 4.1 Inconsistência de documentação de versão Java

- README menciona Java 17+, mas o `pom.xml` fixa `java.version` em 21.
- Recomenda-se alinhar documentação para evitar setup incorreto em onboarding.

### 4.2 CORS fixo para localhost

- Em `SecurityConfig`, apenas `http://localhost:3000` está liberado.
- Isso é aceitável para dev local, mas bloqueia outros ambientes (staging/produção) sem alteração de código.
- Melhor prática: externalizar via variável/propriedade.

### 4.3 Criptografia de senha fora do bean de `PasswordEncoder`

- `AuthenticationController` instancia `new BCryptPasswordEncoder()` diretamente em vez de usar o bean configurado.
- Funciona, mas gera acoplamento desnecessário e dificulta padronização futura (troca de algoritmo/parâmetros).

### 4.4 Expiração do token com offset fixo

- `TokenService` usa `ZoneOffset.of("-03:00")` para calcular expiração.
- Isso pode gerar comportamento confuso entre ambientes/timezones e logs.
- Recomendação: usar UTC consistente (`Instant.now().plus(...)`).

### 4.5 Wrapper de API sem `response.ok`

- No frontend, `api.jsx` trata só 401 explicitamente e tenta parsear todo retorno.
- Falhas 4xx/5xx não-401 podem “passar” sem exceção padronizada.
- Recomendação: lançar erro para `!response.ok`, com payload de erro estruturado.

### 4.6 Sinais de escopo “em evolução”

- README lista recursos “a implementar”, mas o código já possui parte deles.
- Vale atualizar o README para refletir estado real (feito / pendente), melhorando previsibilidade do projeto.

---

## 5) Recomendações priorizadas

### Prioridade alta

1. **Externalizar CORS e secret JWT por ambiente** (dev/stage/prod).
2. **Padronizar tratamento de erros no frontend** (`response.ok` + mensagens).
3. **Padronizar uso do `PasswordEncoder` por injeção**.

### Prioridade média

4. **Ajustar geração de expiração JWT para UTC**.
5. **Atualizar README** (versões reais, status de funcionalidades, instruções de execução).

### Prioridade baixa

6. **Adicionar suíte de testes mínima por domínio** (controller/service/repository).
7. **Adicionar quality gates** (lint frontend, testes backend/frontend em CI).

---

## 6) Diagnóstico de maturidade

- **Maturidade geral**: **intermediária inicial**.
- A base técnica está boa para MVP e crescimento incremental.
- Maiores ganhos imediatos vêm de hardening de configuração (ambiente/segurança), qualidade de erros e documentação operacional.

---

## 7) Próximos passos sugeridos (30/60/90)

- **30 dias**: revisão de configuração por ambiente + atualização README + erros frontend.
- **60 dias**: ampliar testes automatizados em fluxos críticos (auth/favoritos).
- **90 dias**: pipeline CI com checks obrigatórios e cobertura mínima.

