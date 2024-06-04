const express = require('express');
const identity = express.Router();
const getContacts = require('../controllers/create-identity');

identity.post('/', getContacts);

module.exports = identity;
