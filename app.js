const express = require('express'); // Import express
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const SHOPIFY_SECRET = 'key';

app.use(bodyParser.json());

// Webhook for order creation event
app.post('/webhook/orders/create', (req, res) => {
  const orderData = req.body;
  // Log the received order data
  console.log('Order data received', orderData);
  res.status(200).send('Webhook Received');
});

// Start the server
app.post('/webhook/products/update', (req, res) => {
  const product = req.body;
  console.log('Order data received', product);
  res.status(200).send('Webhook Received');
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
