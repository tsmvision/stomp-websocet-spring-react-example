import {FC, useEffect, useState} from 'react'
import './App.css'
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {
    useGetConnectionStatusQuery,
    useGetGreetingQuery, useGetItemListQuery,
    useSendNameMutation
} from "./redux/api/stompApi.ts";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import {setStompConnected, setStompDisconnected} from "./redux/stompConnectionStatus.ts";
import {stompClient} from "./stomp/client.ts";

// container
// button connect / disconnect
// received message input
// submit button

// TODO: stomp.js connection status tracking
// TODO: create rtk query for stomp.js subscribe endpoint
const App: FC = () => {
    const [name, setName] = useState<string>('');
    const [messageList, setMessageList] = useState<string[]>([]);
    const { isConnected } = useAppSelector(state => state.stompConnectionStatus);
    const dispatch = useAppDispatch();

    const { data: stompConnectionStatus } = useGetConnectionStatusQuery();
    const [sendName, { isSuccess: isSendNameSuccess }] = useSendNameMutation();
    const { data: greeting } = useGetGreetingQuery(undefined, { skip: !isConnected });
    const { data: itemList } = useGetItemListQuery(undefined, { skip: !isConnected });

    const handleSendName = () => {
        sendName(name);
    };

    const handleUpdateMessageList = (newData: string | undefined) => {
        if (!newData) {
            return;
        }

        setMessageList((prev) => {
            return [...prev, newData];
        })
    };

    const handleStompConnection = () => {
        if (isConnected) {
            void stompClient.deactivate();
            return;
        }

        stompClient.activate();
    };

    useEffect(() => {
        console.log('greeting: ', greeting);
        handleUpdateMessageList(greeting);
    }, [greeting]);

    useEffect(() => {
        setName('');
    }, [isSendNameSuccess]);

  //
  //   const handleSendList = () => {
  //       if (!stompClient.connected) {
  //           console.log('stomp not connected yet');
  //           return;
  //       }
  //       // sendName(messageToSend);
  //       //
  //       stompClient.publish({
  //           destination: "/app/string_list",
  //           // body: JSON.stringify({'name': messageToSend}),
  //       });
  //   }

    useEffect(() => {
        if (stompConnectionStatus) {
            dispatch(setStompConnected());
        } else {
            dispatch(setStompDisconnected());
        }
    }, [stompConnectionStatus, dispatch]);

    useEffect(() => {
        console.log('itemList: ', itemList);
    }, [itemList]);

    useEffect(() => {
        stompClient.activate();
    }, []);

  return (
    <Container>
        <Row>
            <Col className="mb-3">
              <Button variant='primary' onClick={handleStompConnection}>{isConnected ? "Disconnect": "Connect"}</Button>

            </Col>
        </Row>
        <Row>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <Button onClick={handleSendName}>Submit</Button>
            </InputGroup>
        </Row>
        {
            messageList.map((message )=>
                <Row>
                    <Col>
                        <h3>{message}</h3>
                    </Col>
                </Row>)
        }

        {/*<Row>*/}
        {/*    <Col>*/}
        {/*        <Button onClick={handleSendList}>Request String List</Button>*/}
        {/*    </Col>*/}
        {/*</Row>*/}
    </Container>
  )
}

export default App
