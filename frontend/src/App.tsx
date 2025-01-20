import {FC, useEffect, useState} from 'react'
import './App.css'
import {sendName, stompClient} from "./stomp/client.ts";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";

const App: FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>('');

  const handleConnectionStatus = () => {
      if (!stompClient.connected) {
          stompClient.activate();
          return;
      }

      void stompClient.deactivate();
  }

  const handleSendMessage = () => {
      if (!stompClient.connected) {
          console.log('stomp not connected yet');
          return;
      }
      // sendName(messageToSend);
      //
      stompClient.publish({
          destination: "/app/hello",
          body: JSON.stringify({'name': messageToSend}),
      });
  }

    const handleSendList = () => {
        if (!stompClient.connected) {
            console.log('stomp not connected yet');
            return;
        }
        // sendName(messageToSend);
        //
        stompClient.publish({
            destination: "/app/string_list",
            // body: JSON.stringify({'name': messageToSend}),
        });
    }

  const handleUpdateMessage = (message: string) => {
      setMessageToSend(message);
  }

  useEffect(() => {
      console.log(stompClient.connected);
      if (stompClient.connected) {
          setIsConnected(true)

          return;
      }

      setIsConnected(false);
  }, [setIsConnected]);

  // useEffect(() => {
  //     stompClient.subscribe('/topic/greetings', (greeting) => {
  //         // showGreeting(JSON.parse(greeting.body).content);
  //     });
  // })


// container
    // button connect / disconnect
    // received message input
    // submit button
  return (
    <Container>
        <Row>
            <Col>
              <Button variant='primary' onClick={handleConnectionStatus}>{isConnected ? "Disconnect": "Connect"}</Button>
            </Col>
        </Row>
        <Row>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">message</InputGroup.Text>
                <Form.Control
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={(e) => handleUpdateMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Submit</Button>
            </InputGroup>
        </Row>
        <Row>
            <Col>
                <Button onClick={handleSendList}>Request String List</Button>
            </Col>
        </Row>
    </Container>
  )
}

export default App
