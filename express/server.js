'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const stripe = require("stripe")(
  "sk_test_51MDI1YH7TH175XyNnNsxYEn7vj7Hnpyckm4aKdyIctdpJoSbKtdycMJVf2LBE1AoR5R0iuC4brIJoTHBGPJAOCiu002QO2Vgmf"
);
const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.get("/test", async (req, res) => {
  try {
    const accounts = await stripe.accounts.list();
    // console.log(accounts.data);
    // if (accounts.data) {
    //   accounts.data.forEach(async (acc) => {
    //     await stripe.accounts.del(acc.id);
    //   });
    // }

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
