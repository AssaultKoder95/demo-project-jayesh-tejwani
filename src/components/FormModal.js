import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Form, Header, Button } from 'semantic-ui-react';

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', eventId: this.props.eventId, saved: false, showModal: false };
  }

  closeModal = () => {
    this.setState({ name: '', email: '', saved: false, showModal: false });
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, eventId } = this.state;
    const userId = 1;
    try {
      await axios.post('events/register', {
        name,
        email,
        userId,
        eventId,
      });

      this.setState({ name: '', email: '', saved: true });

      if (this.state.saved) {
        setTimeout(() => {
          this.closeModal();
          this.props.updateUserRegisteredEventList();
        }, 750);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { showModal, name, email } = this.state;
    return (
      <Modal
        as={Form}
        closeIcon
        onClose={this.closeModal}
        onSubmit={(e) => this.handleSubmit(e)}
        size="tiny"
        open={showModal}
        trigger={
          <Button onClick={() => this.setState({ showModal: true })} primary>
            Register
          </Button>
        }
      >
        <Header icon="pencil" content={this.props.header} as="h3" />
        <Modal.Content>
          <Form.Input
            label="Name"
            required
            type="text"
            placeholder="Your name"
            value={name}
            name="name"
            onChange={this.handleChange}
          />
          <Form.Input
            label="Email"
            required
            type="email"
            placeholder="Your email"
            value={email}
            name="email"
            onChange={this.handleChange}
          />

          {this.state.saved ? <div className="success-msg">Successfully registered!</div> : false}
        </Modal.Content>
        <Modal.Actions>
          <Button type="submit" color="green" icon="save" content="Save" value="save" />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FormModal;
