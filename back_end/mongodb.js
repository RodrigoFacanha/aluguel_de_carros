const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/projetoalugeldecarros', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));
