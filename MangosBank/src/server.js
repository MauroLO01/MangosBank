app.post("/login", async (req, res) => {
    const { nome, cpf } = req.body;

    try {
        // verifica se já existe
        const user = await pool.query(
            "SELECT * FROM users WHERE cpf = $1",
            [cpf]
        );

        if (user.rows.length > 0) {
            return res.json(user.rows[0]);
        }

        // cria novo usuário
        const novo = await pool.query(
            "INSERT INTO users (nome, cpf) VALUES ($1, $2) RETURNING *",
            [nome, cpf]
        );

        res.json(novo.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

app.post("/updateSaldo", async (req, res) => {
  const { cpf, saldo, extrato } = req.body;

  await pool.query(
    "UPDATE users SET saldo = $1, extrato = $2 WHERE cpf = $3",
    [saldo, JSON.stringify(extrato), cpf]
  );

  res.json({ ok: true });
});