const Contact = require('../models/contact');
const { Op } = require('@sequelize/core');
const { validateIdentityPayload } = require('../helpers/validator');

/**
 *
 * @param {Object} primaryContact
 * @param {Object} secondaryContact
 * @returns {Object} response
 */

let createResponseBody = (primaryContact, secondaryContact) => {
  let response = {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    },
  };

  if (primaryContact.email) response.contact.emails.push(primaryContact.email);
  if (primaryContact.phoneNumber)
    response.contact.phoneNumbers.push(primaryContact.phoneNumber);

  if (secondaryContact) {
    response.contact.secondaryContactIds.push(secondaryContact.id);
    if (
      secondaryContact.email &&
      primaryContact.email != secondaryContact.email
    )
      response.contact.emails.push(secondaryContact.email);
    if (
      secondaryContact.phoneNumber &&
      primaryContact.phoneNumber != secondaryContact.phoneNumber
    )
      response.contact.phoneNumbers.push(secondaryContact.phoneNumber);
  }
  return response;
};

/**
 *
 * @param {Object} contacts
 * @param {String} email
 * @param {String} phoneNumber
 * @returns {String} Category
 *
 * This function will return the category 1 - 3 based on which either
 * a new contact is created or an existing contact is made secondary
 */
let categoriseId = (contacts, email, phoneNumber) => {
  if (!contacts || contacts.length === 0) {
    return;
  }
  if (contacts.length <= 1) {
    if (contacts[0].email == email && contacts[0].phoneNumber == phoneNumber) {
      return 1;
    }
    return 2;
  }
  return 3;
};

let createContact = (contact) => {
  return Contact.create(contact);
};

let updateContact = (contact) => {
  return Contact.update(contact, {
    where: { id: contact.id },
    returning: true,
  });
};

var createIdentity = (req, res) => {
  try {
    const email = req.body.email ? req.body.email : null;
    const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : null;
    const isPayloadValid = validateIdentityPayload(req.body);

    if (!isPayloadValid.status) {
      return res.status(400).json({ message: isPayloadValid.message });
    }

    Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
      order: [['createdAt', 'ASC']],
    })
      .then(async (data) => {
        let response;
        // fetching secondary or primary contact if user input doesn't fetch both contacts
        if (data.length === 1) {
          const where = {};
          if (data[0].linkPrecedence === 'secondary')
            where['id'] = data[0].linkedId;
          if (data[0].linkPrecedence === 'primary')
            where['linkedId'] = data[0].id;
          let id = await Contact.findAll({
            where,
          });
          if (id.length !== 0) {
            if (id[0].linkPrecedence === 'primary') data = [...id, ...data];
            if (id[0].linkPrecedence === 'secondary') data = [...data, ...id];
          }
        }

        switch (categoriseId(data, email, phoneNumber)) {
          case 1:
            response = createResponseBody(data[0]);
            break;
          case 2:
            const secondaryId = await createContact({
              email: email,
              phoneNumber: phoneNumber,
              linkedId: data[0].id,
              linkPrecedence: 'secondary',
            });
            response = createResponseBody(data[0], secondaryId);
            break;
          case 3:
            if (data[1].linkPrecedence !== 'secondary') {
              let id = JSON.parse(JSON.stringify(data[1].dataValues));
              id.linkPrecedence = 'secondary';
              id.linkedId = data[0].id;
              await updateContact(id);
            }
            response = createResponseBody(data[0], data[1]);
            break;
          default:
            const primaryId = await createContact({
              email: email,
              phoneNumber: phoneNumber,
              linkedId: null,
              linkPrecedence: 'primary',
            });
            response = createResponseBody(primaryId);
        }

        res.status(200).send(response);
      })
      .catch((err) => {
        console.log('Error while querying the data', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } catch (error) {
    console.log('Error during identity creation', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = createIdentity;
