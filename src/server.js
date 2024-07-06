require("express-async-errors");
const createTables = require('./database/sqlite/migrations');

const AppError = require('./utils/AppError');
const express = require('express');

const routes = require('./routes');

const app = express();
app.use(express.json());

app.use(routes);

createTables();

app.use((err, req, res, next) => {
  if(err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

