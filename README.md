# Identity Service

This is a comprehensive application that keep track of a customer's identity across multiple purchases.

## Technologies

- Node.js
- Express.js
- PostgreSQL with Sequelize

## Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com:vishnumallemala/identity-service.git
$ cd identity-service
```

To install dependencies, run:

```sh
$ npm ci
```

Configure environment variables in `.env`

```
PORT=3000
DB_NAME=identity-service
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
DB_DIALECT=postgres
```

## Usage

### Serving the app

```sh
$ npm start
```

The application is running on [localhost](http:localhost:3000/identity) and on [render](http://localhost:3000).

## API

1. **POST /identity** - It creates new identity. (refer [this](https://drive.google.com/file/d/1m57CORq21t0T4EObYu2NqSWBVIP4uwxO/view) to understand functionality)
   - Request Body
     ```
     {
     "email": "user@example.com",
     "phoneNumber": "123456"
     }
     ```
