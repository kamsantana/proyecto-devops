const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'midatabase',
  port: 5432,
});

// Inicialización de la tabla con los nuevos campos requeridos
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        cedula VARCHAR(20) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        edad INT NOT NULL,
        ciudad VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) NOT NULL
      );
    `);
    console.log("Tabla 'usuarios' actualizada en PostgreSQL.");
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  }
};
initDb();

// 1. LEER TODO (GET)
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREAR (POST)
app.post('/usuarios', async (req, res) => {
  const { cedula, nombre, email, edad, ciudad, telefono } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (cedula, nombre, email, edad, ciudad, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cedula, nombre, email, edad, ciudad, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "La cédula o el correo ya existen registrados." });
  }
});

// 3. ACTUALIZAR (PUT)
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { cedula, nombre, email, edad, ciudad, telefono } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET cedula=$1, nombre=$2, email=$3, edad=$4, ciudad=$5, telefono=$6 WHERE id=$7 RETURNING *',
      [cedula, nombre, email, edad, ciudad, telefono, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. ELIMINAR (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: "Usuario eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Backend CRUD escuchando en puerto 5000'));