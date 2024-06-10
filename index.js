const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const identityRoutes = require('./src/routes/identity');
const sequelize = require('./db');
const apiDocument = require('./swagger.json');

app.use(express.json());

app.use('/identity', identityRoutes);

app.use('/', swaggerUi.serve, swaggerUi.setup(apiDocument));

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .send(
//       'Backend Server for Identity-Reconsilation is up and running. Please perform post operation on /identity with an object containing email/phoneNumber to create new contact'
//     );
// });

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
