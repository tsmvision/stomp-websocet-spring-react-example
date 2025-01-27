import { Client } from '@stomp/stompjs';

export const stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    // heartbeatOutgoing: 4000,
    // heartbeatIncoming: 4000,
    // reconnectDelay: 3000,
});

// stompClient.onConnect = (frame) => {
// //     // setConnected(true);
//     console.log('Connected: ' + frame);
//     stompClient.subscribe('/topic/greeting', (data) => {
//         console.log('data.body: ', JSON.parse(data.body));
//     //     // showGreeting(JSON.parse(greeting.body).content);
//     });
// //
// //     stompClient.subscribe('/topic/string_list', (data) => {
// //         console.log('data: ', JSON.parse(data.body));
// //         //     // showGreeting(JSON.parse(greeting.body).content);
// //     });
// //
// //     console.log('/topic/item');
// //     stompClient.subscribe('/topic/item', (data) => {
// //         console.log('data.body: ', data.body);
// //         //     // showGreeting(JSON.parse(greeting.body).content);
// //     });
// //
// //     console.log('/topic/item');
// //     stompClient.subscribe('/app/item', (data) => {
// //         console.log('data.body: ', data.body);
// //         //     // showGreeting(JSON.parse(greeting.body).content);
// //     });
// };

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};



