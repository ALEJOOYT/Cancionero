require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const aplicacion = express();
const puerto = process.env.PUERTO || 3000;

// Configuración de la conexión a PostgreSQL
const poolConexion = new Pool({
    user: process.env.DB_USUARIO || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NOMBRE || 'cancionesDb',
    password: process.env.DB_CONTRASENA || 'postgres',
    port: process.env.DB_PUERTO || 5432,
});

aplicacion.use(express.json());
aplicacion.use(cors());

// Consulta para crear tabla si no existe
const consultaCrearTabla = `
    CREATE TABLE IF NOT EXISTS canciones (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        artista TEXT NOT NULL,
        letra TEXT
    )
`;

// Inicializar base de datos
async function inicializarBaseDatos() {
    try {
        const cliente = await poolConexion.connect();
        await cliente.query(consultaCrearTabla);
        cliente.release();
        console.log('Tabla de canciones inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}

// Obtener todas las canciones
aplicacion.get("/api/canciones", async (solicitud, respuesta) => {
    try {
        const resultado = await poolConexion.query("SELECT * FROM canciones ORDER BY id");
        respuesta.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener canciones:', error);
        respuesta.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una canción por ID
aplicacion.get("/api/canciones/:id", async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;
        const resultado = await poolConexion.query("SELECT * FROM canciones WHERE id = $1", [id]);

        if (resultado.rows.length === 0) {
            return respuesta.status(404).json({ error: 'Canción no encontrada' });
        }

        respuesta.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al obtener canción:', error);
        respuesta.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Agregar una canción
aplicacion.post("/api/canciones", async (solicitud, respuesta) => {
    const { titulo, artista, letra } = solicitud.body;

    // Validación básica de datos
    if (!titulo || !artista) {
        return respuesta.status(400).json({ error: 'Título y artista son obligatorios' });
    }

    try {
        const resultado = await poolConexion.query(
            "INSERT INTO canciones (titulo, artista, letra) VALUES ($1, $2, $3) RETURNING *",
            [titulo, artista, letra]
        );
        respuesta.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar canción:', error);
        respuesta.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar una canción
aplicacion.put("/api/canciones/:id", async (solicitud, respuesta) => {
    const { id } = solicitud.params;
    const { titulo, artista, letra } = solicitud.body;

    // Validación básica de datos
    if (!titulo || !artista) {
        return respuesta.status(400).json({ error: 'Título y artista son obligatorios' });
    }

    try {
        const resultado = await poolConexion.query(
            "UPDATE canciones SET titulo = $1, artista = $2, letra = $3 WHERE id = $4 RETURNING *",
            [titulo, artista, letra, id]
        );

        if (resultado.rows.length === 0) {
            return respuesta.status(404).json({ error: 'Canción no encontrada' });
        }

        respuesta.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al actualizar canción:', error);
        respuesta.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una canción
aplicacion.delete("/api/canciones/:id", async (solicitud, respuesta) => {
    const { id } = solicitud.params;

    try {
        const resultado = await poolConexion.query("DELETE FROM canciones WHERE id = $1 RETURNING *", [id]);

        if (resultado.rows.length === 0) {
            return respuesta.status(404).json({ error: 'Canción no encontrada' });
        }

        respuesta.json({ mensaje: 'Canción eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar canción:', error);
        respuesta.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar servidor
aplicacion.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
    inicializarBaseDatos();
});

// Manejo de errores del pool de conexión
poolConexion.on('error', (error) => {
    console.error('Error inesperado en el pool de PostgreSQL', error);
});

// Cierre graceful de la conexión al pool
process.on('SIGINT', () => {
    poolConexion.end(() => {
        console.log('Pool de PostgreSQL cerrado');
        process.exit(0);
    });
});