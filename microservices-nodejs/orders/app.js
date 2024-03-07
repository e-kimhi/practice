const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const  expressjwt  = require('express-jwt');

const app = express();
const port = process.env.PORT || 3001;

const jwtSecret = 'my-secret-key';

app.post('/orders/auth', (req, res) => {
  const token = jwt.sign({ user: 'orders-service' }, jwtSecret, { expiresIn: '1h' });
  res.send({ token });
});

app.use(expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: ['/orders/auth'] }));



app.get('/', (req, res) => {
  res.send('Hello from the Microservice!');
});

app.get('/orders/inventory', async (req, res) => {
  try {
    const token = req.headers.authorization;
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaW52ZW50b3J5LXNlcnZpY2UiLCJpYXQiOjE3MDkzMjM2MzIsImV4cCI6MTcwOTMyNzIzMn0.94aJorCaVYRyrraXFdd3jl3Cx9-abcPHDQx7X5gTB-A";
    
    const inventoryResponse = await axios.get('http://localhost:3002/inventory', { headers: { authorization: token } });
    res.send(`Orders Microservice received data from Inventory Microservice: ${inventoryResponse.data}`);
  } catch (error) {
    console.error(`Error fetching data from Inventory Microservice: ${error.message}`);
    res.status(500).send('Error fetching data from Inventory Microservice');
  }
});

app.listen(port, () => {
  console.log(`Microservice listening on port ${port}`);
});