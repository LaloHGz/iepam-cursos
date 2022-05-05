-- creating database
CREATE DATABASE iepam;

-- using the database
use iepam;

-- creating table
CREATE TABLE usuario (
    id_usuario INT(6) UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    rol VARCHAR(150) NOT NULL,
    foto VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_usuario)
);

CREATE TABLE curso (
    id_curso INT(6) UNSIGNED AUTO_INCREMENT,
    id_usuario INT(6) UNSIGNED NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    num_lecciones INT(6) NOT NULL,
    imagen VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_curso),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE leccion (
    id_leccion INT(6) UNSIGNED AUTO_INCREMENT,
    id_curso INT(6) UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tiempo_minutos INT(6) NOT NULL,
    num_leccion INT(6) NOT NULL,
    archivo_url VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_leccion),
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);

CREATE TABLE comentario (
    id_comentario INT(6) UNSIGNED AUTO_INCREMENT,
    id_usuario INT(6) UNSIGNED NOT NULL,
    id_leccion INT(6) UNSIGNED NOT NULL,
    comentario VARCHAR(300) NOT NULL,
    PRIMARY KEY (id_comentario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_leccion) REFERENCES leccion(id_leccion)
);

CREATE TABLE avance (
    id_avance INT(6) UNSIGNED AUTO_INCREMENT,
    id_usuario INT(6) UNSIGNED NOT NULL,
    id_curso INT(6) UNSIGNED NOT NULL,
    num_leccion INT(6) NOT NULL,
    PRIMARY KEY (id_avance),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES leccion(id_curso)
);