import express from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("1 - iniciou o server")
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

console.log("2 - pool criado")

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "conectado com sucesso!!", time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/cadastro", async (req, res) => {
    const {
        nome,
        cpf,
        email,
        dataNascimento,
        telefone,
        profissao,
        rendaMensal,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        senha
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users 
            (nome, cpf, email, data_nascimento, telefone, profissao, renda_mensal, cep, rua, numero, bairro, cidade, estado, senha)
            VALUES 
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *`,
            [
                nome,
                cpf,
                email,
                dataNascimento,
                telefone,
                profissao,
                rendaMensal,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado,
                senha
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE cpf = $1 AND senha = $2",
            [cpf, senha]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "CPF ou senha inválidos" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/deposito", async (req, res) => {
    const { user_id, valor } = req.body;

    try {
        // atualiza saldo
        await pool.query(
            "UPDATE users SET saldo = saldo + $1 WHERE id = $2",
            [valor, user_id]
        );

        // cria transação
        await pool.query(
            "INSERT INTO transactions (user_id, tipo, valor, descricao) VALUES ($1, $2, $3, $4)",
            [user_id, "deposito", valor, "Depósito realizado"]
        );

        res.json({ message: "Depósito realizado 💰" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

console.log("3 - antes do listen")
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

app.post("/cadastro", async (req, res) => {
    const {
        nome,
        cpf,
        email,
        dataNascimento,
        telefone,
        profissao,
        rendaMensal,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        senha
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users
            (nome, cpf, email, dataNascimento, telefone, profissao, rendaMensal, cep, rua, numero, bairro, cidade, estado, senha
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *`,
            [nome, cpf, email, dataNascimento, telefone, profissao, rendaMensal, cep, rua, bairro, cidade, estado, senha]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});