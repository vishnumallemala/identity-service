const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Contact = sequelize.define(
  'Contact',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address. Please provide a valid email address',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^\+?[0-9]+$/],
          msg: 'Invalid phone number. PhoneNumber can contain only numeric values',
        },
      },
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkPrecedence: {
      type: DataTypes.ENUM,
      values: ['primary', 'secondary'],
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'contacts',
  }
);

// Export the model
module.exports = Contact;
