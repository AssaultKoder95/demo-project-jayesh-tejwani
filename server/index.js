const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { events } = require('./constants');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/events', (req, res) => {
  try {
    const { date } = req.query;

    if (!date) return res.send(events);

    const filteredEvents = events.filter(({ timestamp }) => {
      const eventDate = new Date(timestamp).toDateString();
      return new Date(parseInt(date, 10)).toString().includes(eventDate);
    });

    return res.send(filteredEvents);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

app.get('/events/occurences', (req, res) => {
  try {
    const currentTimestamp = new Date().getTime();

    const filteredEvents = events
      .filter(({ timestamp }) => {
        console.log(timestamp > currentTimestamp);
        return timestamp > currentTimestamp;
      })
      .map(({ timestamp }) => timestamp);

    return res.send(filteredEvents);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

// @TODO: do permission checks

app.get('/events/register', (req, res) => {
  try {
    const { userId, eventId, username, email } = req.body;

    if (!userId || !eventId || !username || !email) {
      throw { reason: 'Missing / invalid arguments', status: 400 };
    }
  } catch (error) {
    if (error.status) {
      return res.status(error.status).send(error);
    }

    return res.send(500);
  }
});

app.get('/users/:userId/registered-events', (req, res) => {
  try {
    // const userId = req.params.userId;

    res.send([]);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

app.listen(process.env.PORT || 5000);
