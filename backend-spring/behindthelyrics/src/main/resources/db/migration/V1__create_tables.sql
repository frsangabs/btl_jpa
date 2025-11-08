CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE bandas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    lore TEXT
);

CREATE TABLE albuns (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255),
    lore TEXT,
    ano_lancamento INT NOT NULL,
    banda_id BIGINT NOT NULL
);

CREATE TABLE musicas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255),
    lore TEXT,
    album_id BIGINT,
    banda_id BIGINT
);

CREATE TABLE comentarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto TEXT,
    data_criacao TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    banda_id BIGINT,
    album_id BIGINT,
    musica_id BIGINT
);

CREATE TABLE favoritos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    banda_id BIGINT,
    album_id BIGINT,
    musica_id BIGINT
);
