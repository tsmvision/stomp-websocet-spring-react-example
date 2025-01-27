import {FC, useEffect, useState} from 'react'
import './App.css'
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {
    Greeting,
    stompApi,
    useGetConnectionStatusQuery,
    useGetGreetingQuery, useGetItemListQuery,
    useSendNameMutation
} from "./redux/api/stompApi.ts";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import {setStompConnected, setStompDisconnected} from "./redux/stompConnectionStatus.ts";
import {stompClient} from "./stomp/client.ts";

// TODO: stomp.js connection status tracking
// TODO: create rtk query for stomp.js subscribe endpoint
const App: FC = () => {
    const [name, setName] = useState<string>('');
    const [messageList, setMessageList] = useState<Greeting[]>([]);
    const { isConnected } = useAppSelector(state => state.stompConnectionStatus);
    const dispatch = useAppDispatch();

    const { data: stompConnectionStatus } = useGetConnectionStatusQuery();
    const [sendName, { isSuccess: isSendNameSuccess }] = useSendNameMutation();
    const { data: greeting } = useGetGreetingQuery(undefined, { skip: !isConnected });
    const { data: itemList } = useGetItemListQuery(undefined, { skip: !isConnected });

    const handleSendName = () => {
        sendName(name);
    };

    const handleUpdateMessageList = (newData: Greeting | undefined) => {
        if (!newData) {
            return;
        }

        setMessageList((prev) => {
            return [...prev, newData];
        })
    };

    // fast deactivate -> activate not calling subscribiptions, slow deactivate -> activate load subscriptions
    const handleStompConnection = async () => {
        if (isConnected) {
            await stompClient.deactivate()
            dispatch(stompApi.util.resetApiState());
            return;
        }

        await stompClient.deactivate()
        dispatch(stompApi.util.resetApiState());
        stompClient.activate();
    };

    useEffect(() => {
        console.log('greeting: ', greeting);
        handleUpdateMessageList(greeting);
    }, [greeting]);

    useEffect(() => {
        setName('');
    }, [isSendNameSuccess]);

    useEffect(() => {
        setMessageList([]);
    }, [isConnected]);

    useEffect(() => {
        if (stompConnectionStatus) {
            dispatch(setStompConnected());
            return;
        }
        dispatch(setStompDisconnected());
    }, [stompConnectionStatus, dispatch]);

    useEffect(() => {
        console.log('itemList: ', itemList);
    }, [itemList]);

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
        <Row>
            <Col className='mt-3'>
                <h3>Data from /topic/greeting</h3>
            </Col>
        </Row>
        {
            messageList.map((message )=>
                <Row>
                    <Col>
                        <h3>{message.content}</h3>
                    </Col>
                </Row>)
        }

        <Row>
            <Col className='mt-5'>
                <h3>Data from /topic/item</h3>
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    (itemList === undefined) ? 'NO DATA': itemList.toString()
                }
            </Col>

        </Row>

        {/*<Row>*/}
        {/*    <Col>*/}
        {/*        <Button onClick={handleSendList}>Request String List</Button>*/}
        {/*    </Col>*/}
        {/*</Row>*/}
    </Container>
  )
}

export default App
