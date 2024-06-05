require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
// Create a new instance of Sequelize, passing the connection parameters

let options = {};

if (process.env.DB_HOST === 'localhost') {
  options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Disable logging or set it to console.log for detailed logs
  };
} else {
  const caCert = fs.readFileSync('./ca.pem');
  options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: caCert.toString(),
      },
    },
    logging: false, // Disable logging or set it to console.log for detailed logs
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  options
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
})();

module.exports = sequelize;
