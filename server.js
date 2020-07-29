const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/events', (req, res) => {
  console.log(req.query);
});

app.post('/events/:id/register', (req, res) => {
  console.log(req.params);
  console.log(req.body);
});

app.listen(process.env.PORT || 5000);
