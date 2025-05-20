const express = require('express');
const { connect } = require('./db'); // importar conexão
const app = express();
const port = 3000;

app.use(express.json());

let db; // vai guardar a conexão

connect().then(database => {
  db = database;

  // --- ROTAS CRUD usando MongoDB ---

  // Read all
  app.get('/carros', async (req, res) => {
    try {
      const carros = await db.collection('carros').find().toArray();
      res.json(carros);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar carros' });
    }
  });

  // Read one
  app.get('/carros/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const carro = await db.collection('carros').findOne({ id: id });
      if (!carro) return res.status(404).json({ error: 'Carro não encontrado' });
      res.json(carro);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar carro' });
    }
  });

  // Create
  app.post('/carros', async (req, res) => {
    try {
      const { modelo, precoDiaria } = req.body;

      // Para id auto-incrementar, você pode buscar o maior id já salvo
      const ultimoCarro = await db.collection('carros').find().sort({ id: -1 }).limit(1).toArray();
      const id = ultimoCarro.length > 0 ? ultimoCarro[0].id + 1 : 1;

      const novoCarro = { id, modelo, precoDiaria };
      await db.collection('carros').insertOne(novoCarro);
      res.status(201).json(novoCarro);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar carro' });
    }
  });

  // Update
  app.put('/carros/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { modelo, precoDiaria } = req.body;

    try {
      const result = await db.collection('carros').updateOne(
        { id: id },
        { $set: { modelo, precoDiaria } }
      );

      if (result.matchedCount === 0)
        return res.status(404).json({ error: 'Carro não encontrado' });

      const carroAtualizado = await db.collection('carros').findOne({ id: id });
      res.json(carroAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
  });

  // Delete
  app.delete('/carros/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      const result = await db.collection('carros').deleteOne({ id: id });
      if (result.deletedCount === 0)
        return res.status(404).json({ error: 'Carro não encontrado' });

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar carro' });
    }
  });

  // Iniciar servidor após conectar no DB
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});

