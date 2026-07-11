const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'midatabase',
  port: 5432,
});

// Esperar conexión con PostgreSQL
async function esperarBD() {
  while (true) {
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL conectado');
      break;
    } catch (err) {
      console.log('⌛ Esperando PostgreSQL...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Crear tabla
async function initDb() {
  await esperarBD();

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

    console.log("✅ Tabla usuarios lista");
  } catch (err) {
    console.error(err);
  }
}

initDb();


// =============================
// RUTA PRINCIPAL
// =============================
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend funcionando correctamente',
    estado: 'OK'
  });
});

// =============================
// HEALTHCHECK
// =============================
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'UP',
      database: 'Conectada'
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      database: 'Desconectada'
    });
  }
});

// =============================
// OBTENER USUARIOS
// =============================
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =============================
// CREAR USUARIO
// =============================
app.post('/usuarios', async (req, res) => {

  const {
    cedula,
    nombre,
    email,
    edad,
    ciudad,
    telefono
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO usuarios
      (cedula,nombre,email,edad,ciudad,telefono)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        cedula,
        nombre,
        email,
        edad,
        ciudad,
        telefono
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    res.status(400).json({
      error: "La cédula o el correo ya existen."
    });

  }

});

// =============================
// ACTUALIZAR
// =============================
app.put('/usuarios/:id', async (req, res) => {

  const { id } = req.params;

  const {
    cedula,
    nombre,
    email,
    edad,
    ciudad,
    telefono
  } = req.body;

  try {

    const result = await pool.query(
      `UPDATE usuarios
      SET
      cedula=$1,
      nombre=$2,
      email=$3,
      edad=$4,
      ciudad=$5,
      telefono=$6
      WHERE id=$7
      RETURNING *`,
      [
        cedula,
        nombre,
        email,
        edad,
        ciudad,
        telefono,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }

});

// =============================
// ELIMINAR
// =============================
app.delete('/usuarios/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      'DELETE FROM usuarios WHERE id=$1',
      [id]
    );

    res.json({
      mensaje: 'Usuario eliminado correctamente'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// =============================
// INICIAR SERVIDOR
// =============================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend iniciado en puerto ${PORT}`);
});