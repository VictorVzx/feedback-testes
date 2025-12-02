import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pg from "pg";
import serverless from "serverless-http"; // <- ADICIONADO

const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o banco - Railway
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão
pool.connect()
  .then(() => console.log("Conectado ao PostgreSQL da Railway com sucesso!"))
  .catch(err => console.error("Erro ao conectar no PostgreSQL:", err));

// Rota de registro
app.post("/register", async (req, res) => {
  const { nome, insta } = req.body;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ error: "O campo nome é obrigatório." });
  }

  const instaFinal = insta && insta.trim() !== "" ? insta.trim() : null;

  try {
    const result = await pool.query(
      "INSERT INTO users (nome, insta) VALUES ($1, $2) RETURNING id;",
      [nome.trim(), instaFinal]
    );

    const userId = result.rows[0].id;

    return res.json({ message: "Usuário registrado com sucesso", userId });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Este Instagram já está registrado." });
    }

    return res.status(500).json({ error: "Erro interno ao registrar usuário." });
  }
});

app.post("/feedback", async (req, res) => {
  const { user_id, option, comment } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  if (!option || option.trim() === "") {
    return res.status(400).json({ error: "O campo opinião é obrigatório." });
  }

  const commentFinal = comment && comment.trim() !== "" ? comment.trim() : null;

  try {
    await pool.query(
      "INSERT INTO feedback (user_id, option, comment) VALUES ($1, $2, $3);",
      [user_id, option.trim(), commentFinal]
    );

    return res.json({ message: "Feedback registrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao registrar feedback:", err);
    return res.status(500).json({ error: "Erro interno ao registrar feedback." });
  }
});

// ❌ Remover app.listen()
// app.listen(PORT)

// ✅ Exportar como serverless handler
export const handler = serverless(app);
