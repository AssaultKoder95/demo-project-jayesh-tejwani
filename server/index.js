const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const lowdb = require('lowdb');
const morgan = require('morgan');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = lowdb(adapter);
const { events } = require('./constants');

db.defaults({ events }).write();

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.static(path.join(__dirname, '/../', 'build')));

app.get('/events', (req, res) => {
  try {
    const { date } = req.query;

    if (!date) return res.send(events);

	const events = db.get('events').value();
    const filteredEvents = events.filter(({ timestamp }) => {
	  const eventDate = new Date(timestamp).toDateString();
      return new Date(parseInt(date, 10) + + 19800000).toString().includes(eventDate);
    });

    return res.send(filteredEvents);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.get('/events/occurences', (req, res) => {
  try {
    const currentTimestamp = new Date().getTime();

    const events = db.get('events').value();
    const filteredEvents = events
      .filter(({ timestamp }) => timestamp > currentTimestamp)
      .map(({ timestamp }) => timestamp);

    return res.send(filteredEvents);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// @TODO: do permission checks

app.post('/events/register', (req, res) => {
  try {
    const { userId, eventId, name, email } = req.body;

    if (!userId || !eventId || !name || !email) {
      throw { reason: 'Missing / invalid arguments', status: 400 };
    }

    const event = db.get('events').find({ id: eventId }).value();
    const existingUsers = event.registeredUsers;

    if (existingUsers.some(({ userId: id }) => id === userId)) {
      return res.sendStatus(200);
    }

    existingUsers.push({ userId, name, email });

    db.get('events').find({ id: eventId }).update({ registeredUsers: existingUsers }).write();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).send(error);
    }

    return res.sendStatus(500);
  }
});

app.get('/users/:userId/registered-events', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const events = db.get('events').value();

    const filteredEvents = events.filter(({ registeredUsers }) =>
      registeredUsers.some(({ userId: id }) => id === userId)
    );

    return res.send(filteredEvents);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../', 'build', 'index.html'));
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
