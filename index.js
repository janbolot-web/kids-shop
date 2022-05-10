const express = require("express");
const { default: mongoose } = require("mongoose");
const { port, mongoUri } = require("./config");

const PORT = port || 5000;

const app = express();

app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes'))

const start = async () => {
  await mongoose.connect(mongoUri);
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
  try {
  } catch (e) {
    console.log(e);
  }
};

start();
