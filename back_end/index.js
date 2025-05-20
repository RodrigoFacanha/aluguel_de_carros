const express = require('express');
const { connect } = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

let db; 

connect().then(database => {
  db = database;

  app.get('/carros', async (req, res) => {
  try {
    const { marca, cidade } = req.query;

    const filtro = {};
    if (marca) filtro.marca = marca.toLowerCase(); 
    if (cidade) filtro.cidade = cidade.toLowerCase(); 

    const carros = await db.collection('carros').find(filtro).toArray();
    res.json(carros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});

  app.post('/carros', async (req, res) => {
    try {
      const { modelo, precoDiaria } = req.body;

      const ultimoCarro = await db.collection('carros').find().sort({ id: -1 }).limit(1).toArray();
      const id = ultimoCarro.length > 0 ? ultimoCarro[0].id + 1 : 1;

      const novoCarro = { id, modelo, precoDiaria };
      await db.collection('carros').insertOne(novoCarro);
      res.status(201).json(novoCarro);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar carro' });
    }
  });

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

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


});

