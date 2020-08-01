import React from 'react';
import { Header, Container, Item } from 'semantic-ui-react';
import ShowLabelGroup from './GroupLabels';

const RegisteredEvent = ({ events }) => (
  <Container style={{ overflow: 'auto', maxHeight: '100%' }}>
    <Header as="h3">Registered Events</Header>
    <Item.Group divided>
      {!events.length ? (
        <Item>
          <Item.Content as="a">
            <Item.Header>No events registered so far!</Item.Header>{' '}
          </Item.Content>
        </Item>
      ) : (
        ''
      )}

      {events.map((event) => (
        <Item key={event.id}>
          <Item.Content>
            <Item.Header as="a">
              {event.name} | {event.timestring}
            </Item.Header>
            <Item.Meta>
              <ShowLabelGroup labels={event.labels} />
            </Item.Meta>
            <Item.Description>{event.description}</Item.Description>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  </Container>
);

export default RegisteredEvent;
