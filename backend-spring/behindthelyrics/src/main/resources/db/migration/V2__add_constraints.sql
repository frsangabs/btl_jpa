ALTER TABLE albuns
ADD CONSTRAINT fk_albuns_banda
FOREIGN KEY (banda_id) REFERENCES bandas (id) ON DELETE CASCADE;

ALTER TABLE musicas
ADD CONSTRAINT fk_musicas_album
FOREIGN KEY (album_id) REFERENCES albuns (id) ON DELETE SET NULL;

ALTER TABLE musicas
ADD CONSTRAINT fk_musicas_banda
FOREIGN KEY (banda_id) REFERENCES bandas (id) ON DELETE SET NULL;

ALTER TABLE comentarios
ADD CONSTRAINT fk_comentarios_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

ALTER TABLE comentarios
ADD CONSTRAINT fk_comentarios_banda
FOREIGN KEY (banda_id) REFERENCES bandas (id) ON DELETE SET NULL;

ALTER TABLE comentarios
ADD CONSTRAINT fk_comentarios_album
FOREIGN KEY (album_id) REFERENCES albuns (id) ON DELETE SET NULL;

ALTER TABLE comentarios
ADD CONSTRAINT fk_comentarios_musica
FOREIGN KEY (musica_id) REFERENCES musicas (id) ON DELETE SET NULL;

ALTER TABLE favoritos
ADD CONSTRAINT fk_favoritos_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

ALTER TABLE favoritos
ADD CONSTRAINT fk_favoritos_banda
FOREIGN KEY (banda_id) REFERENCES bandas (id) ON DELETE SET NULL;

ALTER TABLE favoritos
ADD CONSTRAINT fk_favoritos_album
FOREIGN KEY (album_id) REFERENCES albuns (id) ON DELETE SET NULL;

ALTER TABLE favoritos
ADD CONSTRAINT fk_favoritos_musica
FOREIGN KEY (musica_id) REFERENCES musicas (id) ON DELETE SET NULL;
