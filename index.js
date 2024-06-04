const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const identityRoutes = require('./src/routes/identity');
const sequelize = require('./db');

app.use(express.json());

app.use('/identity', identityRoutes);

(async () => {
  try {
    await sequelize.sync();
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Unable to sync the database:', error);
  }
})();

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server encountered an error during startup', err);
    return;
  }
  console.log('Server is running on port', PORT);
});
