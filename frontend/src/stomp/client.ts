import { Client } from '@stomp/stompjs';

// activate
// onConnect -> update value into state
// display

// create send button

export const stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws'
});

stompClient.onConnect = (frame) => {
    // setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (data) => {
        console.log('data.body: ', JSON.parse(data.body));
    //     // showGreeting(JSON.parse(greeting.body).content);
    });

    stompClient.subscribe('/topic/string_list', (data) => {
        console.log('data: ', JSON.parse(data.body));
        //     // showGreeting(JSON.parse(greeting.body).content);
    });

    console.log('/topic/item');
    stompClient.subscribe('/app/item', (data) => {
        console.log('data.body: ', data.body);
        //     // showGreeting(JSON.parse(greeting.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

// function setConnected(connected) {
//     $("#connect").prop("disabled", connected);
//     $("#disconnect").prop("disabled", !connected);
//     if (connected) {
//         $("#conversation").show();
//     }
//     else {
//         $("#conversation").hide();
//     }
//     $("#greetings").html("");
// }

// export const connect = (): void => {
//     stompClient.activate();
// }
//
// export const disconnect = (): void => {
//     stompClient.deactivate();
//     // setConnected(false);
//     console.log("Disconnected");
// }

export const sendName = (name: string): void => {
    sendName(name);
}

export const getList = () => {

}

// function showGreeting(message) {
//     $("#greetings").append("<tr><td>" + message + "</td></tr>");
// }

// $(function () {
//     $("form").on('submit', (e) => e.preventDefault());
//     $( "#connect" ).click(() => connect());
//     $( "#disconnect" ).click(() => disconnect());
//     $( "#send" ).click(() => sendName());
// });

