import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import { Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';

import EventList from './components/EventList';
import RegisteredEvent from './components/RegisteredEvents';

import 'react-calendar/dist/Calendar.css';
import './App.css';

function getEventsOnDate({ allEventsTimestamp, date }) {
  const eventOnDate = allEventsTimestamp.filter((timestamp) => {
    const eventDate = new Date(timestamp).toDateString();
    return new Date(date).toString().includes(eventDate);
  });
  return eventOnDate;
}

const eventOccurenceHandler = ({ date, view, allEventsTimestamp }) => {
  if (view === 'month') {
    const isEventOnDate = getEventsOnDate({ allEventsTimestamp, date });
    return isEventOnDate.length ? '*' : '';
  }

  return '';
};

function App() {
  const [date, setDate] = useState(new Date());
  const [currentDayEvents, setCurrentDayEvents] = useState([]);
  const [allEventsTimestamp, setAllEvents] = useState([]);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const [loaderState, setLoaderState] = useState(true);

  useEffect(() => {
    async function fetchData() {
	  setLoaderState(true);
      const { data: currentDayEvents } = await axios(`/events?date=${date.getTime()}`);
      const { data: allEventsTimestamp } = await axios(`/events/occurences`);
      const { data: allUserRegisteredEvents } = await axios(`/users/1/registered-events`);

      setCurrentDayEvents(currentDayEvents);
      setAllEvents(allEventsTimestamp);
      setUserRegisteredEvents(allUserRegisteredEvents);
      setLoaderState(false);
    }
    fetchData();
  }, [date]);

  async function onClickDay(date) {
    await setDate(date);
  }

  function updateUserRegisteredEventList() {
    setDate(new Date());
  }

  return (
    <>
      <Header as="h2" content="Life Yoga" style={{ margin: '1em 0em 1em' }} textAlign="center" />
      <Grid container columns={2} stackable>
        <Grid.Column>
          <Segment>
            <Calendar
              value={date}
              tileContent={({ view, date }) => eventOccurenceHandler({ view, date, allEventsTimestamp })}
              tileClassName="calendar-tile"
              style={{ height: '100%' }}
              onClickDay={onClickDay}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column className="event-list">
          <Dimmer active={loaderState} inverted>
            <Loader />
          </Dimmer>
          <EventList list={currentDayEvents} updateUserRegisteredEventList={updateUserRegisteredEventList} />
        </Grid.Column>
      </Grid>
      <Grid container>
        <Grid.Column>
          <Segment>
            <Dimmer active={loaderState} inverted>
              <Loader />
            </Dimmer>
            <RegisteredEvent events={userRegisteredEvents} />
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default App;
