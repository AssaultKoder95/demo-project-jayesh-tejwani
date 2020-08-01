import React from 'react';
import { Header, Container, Item } from 'semantic-ui-react';
import ShowLabelGroup from './GroupLabels';
import FormModal from './FormModal';

const EventList = ({ list, updateUserRegisteredEventList }) => (
  <Container style={{ overflow: 'auto', maxHeight: '100%' }}>
    <Header as="h3">Events</Header>
    <Item.Group divided>
      {!list.length ? (
        <Item>
          <Item.Content as="a">
            <Item.Header>No events available</Item.Header>{' '}
          </Item.Content>
        </Item>
      ) : (
        ''
      )}

      {list.map((item) => (
        <Item key={item.id}>
          <Item.Content>
            <Item.Header as="a">
              {item.name} | {item.timestring}
            </Item.Header>
            <Item.Meta>
              <ShowLabelGroup labels={item.labels} />
            </Item.Meta>
            <Item.Description>{item.description}</Item.Description>
            <Item.Extra>
              <FormModal
                eventId={item.id}
                header={`${item.name} | ${item.timestring}`}
                updateUserRegisteredEventList={updateUserRegisteredEventList}
              />
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  </Container>
);

export default EventList;
