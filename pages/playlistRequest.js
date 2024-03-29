import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Slider from '../components/Slider';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import images from '../styles/Images.module.css';
import { getSession } from 'next-auth/react';

export default function Playlistform() {
  // Keep track of the submit button's state
  const [click, setClick] = useState(false);

  // Handle the submit event on form submit
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page
    event.preventDefault();

    // Check user is signed in to use the api
    const session = await getSession();
    // Prevent api call if user is not signed in
    if (!session) {
      return alert('You must be signed in to use this service 🤖');
    }

    // Start spinner
    setClick(true);
    // Get data from the form.
    const data = {
      topic: event.target.topic.value,
      size: event.target.size.value,
    }

    const JSONdata = JSON.stringify(data);

    // Send form data to API and get a response
    const response = await fetch('/api/playlistMaker', {

      body: JSONdata,

      //Send JSON data to server
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    // Get the response data from server as JSON
    try {
      const result = await response.json();
      alert(`${result.data}`);
    } catch (err) {
      alert('Your playlist has been successfully created 🎉\nCheck your YouTube account!')
    }

    // Stop spinner
    setClick(false);
  }

  return (
    <>
      <div className={styles.generator}>GENERATOR</div>
      <br />
      <Container className={styles.formgroup}>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className='mb-3' controlId='topic'>
            <Form.Label>
              Topic
            </Form.Label>
            <Col sm={12}>
              <Form.Control required type='text' placeholder='Lofi hip hop' />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='mb-3' controlId='size'>
            <Form.Label>
              Size
            </Form.Label>
            <Col sm={12}>
              <Slider />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='mb-3'>
            <Col className='d-grid gap-2'>
              <Button variant='primary' size='lg' type='submit'>
                {!click && 'Create'}
                {click && <Spinner animation='border' variant='light' />}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
      <p style={{ textAlign: 'center'}}>
        <i>*Note: You must have a YouTube Channel on the account you wish to make the playlist for.</i>
      </p>

      <div className={images.listening}>
        <Image src='/listening.svg' alt='pic1' width={200} height={200}/>
      </div>
      <div className={images.vibin}>
        <Image src='/vibin.svg' alt='pic2' width={200} height={200}/>
      </div>

    </>
  );
}