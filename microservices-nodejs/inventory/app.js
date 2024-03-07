const express = require('express');
const jwt = require('jsonwebtoken');
const {expressjwt: expressjwt } = require('express-jwt');

const app = express();
const port = process.env.PORT || 3002;

const jwtSecret = 'my-secret-key';

app.post('/inventory/auth', (req, res) => {
  const token = jwt.sign({ user: 'inventory-service' }, jwtSecret,{ expiresIn: '1h' });
  res.send({ token });
  // res.json(token);
});

app.use(expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: ['/inventory/auth'] }));


app.get('/inventory', (req, res) => {
  res.send('Hello from the Inventory Microservice!');
});

app.listen(port, () => {
  console.log(`Inventory Microservice listening on port ${port}`);
});