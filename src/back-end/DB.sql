-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Alumnos (
  dni character varying NOT NULL,
  nombre character varying,
  apellido character varying,
  email character varying,
  fecha_inicio smallint DEFAULT '1'::smallint,
  carrera character varying DEFAULT 'industrial'::character varying,
  legajo character varying,
  PRE real,
  IR real,
  CONSTRAINT Alumnos_pkey PRIMARY KEY (dni)
);
CREATE TABLE public.Examen (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dni_alumno character varying NOT NULL,
  id_materia bigint,
  nota smallint,
  CONSTRAINT Examen_pkey PRIMARY KEY (id),
  CONSTRAINT Examen_id_materia_fkey FOREIGN KEY (id_materia) REFERENCES public.Materia(id),
  CONSTRAINT Examen_dni_alumno_fkey FOREIGN KEY (dni_alumno) REFERENCES public.Alumnos(dni)
);
CREATE TABLE public.Materia (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL,
  cuatrimestre smallint,
  coeficiente real,
  notaMinima real,
  CONSTRAINT Materia_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Semaforo (
  dni_alumno character varying NOT NULL,
  color character varying,
  score real NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Semaforo_pkey PRIMARY KEY (dni_alumno),
  CONSTRAINT Semaforo_dni_alumno_fkey FOREIGN KEY (dni_alumno) REFERENCES public.Alumnos(dni)
);
CREATE TABLE public.Encuestas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dni_alumno character varying,
  score real,
  peso real DEFAULT '1'::real,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  observaciones text,
  CONSTRAINT Encuestas_pkey PRIMARY KEY (id),
  CONSTRAINT Encuestas_dni_alumno_fkey FOREIGN KEY (dni_alumno) REFERENCES public.Alumnos(dni)
);
CREATE TABLE public.Respuestas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dni_alumno character varying,
  id_encuesta bigint,
  pregunta text,
  respuesta text,
  CONSTRAINT Respuestas_pkey PRIMARY KEY (id),
  CONSTRAINT Respuestas_id_encuesta_fkey FOREIGN KEY (id_encuesta) REFERENCES public.Encuestas(id),
  CONSTRAINT Respuestas_dni_alumno_fkey FOREIGN KEY (dni_alumno) REFERENCES public.Alumnos(dni)
);
CREATE TABLE public.Log (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dni_usuario bigint,
  tipo_accion text,
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Usuarios (
  dni character varying NOT NULL,
  rol text,
  ult_coneccion timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Usuarios_pkey PRIMARY KEY (dni)
);
CREATE TABLE public.Tutores (
  dni character varying NOT NULL,
  nombre text,
  apellido text,
  email text,
  CONSTRAINT Tutores_pkey PRIMARY KEY (dni),
  CONSTRAINT Tutores_dni_fkey FOREIGN KEY (dni) REFERENCES public.Usuarios(dni)
);
CREATE TABLE public.Tutor-Alumno (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dni_tutor character varying,
  dni_alumno character varying,
  created_at timestamp with time zone,
  CONSTRAINT Tutor-Alumno_pkey PRIMARY KEY (id),
  CONSTRAINT Tutor-Alumno_dni_tutor_fkey FOREIGN KEY (dni_tutor) REFERENCES public.Tutores(dni),
  CONSTRAINT Tutor-Alumno_dni_alumno_fkey FOREIGN KEY (dni_alumno) REFERENCES public.Alumnos(dni)
);
