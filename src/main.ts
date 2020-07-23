// import { of, Observable, throwError } from 'rxjs'
// import { map, take, mergeMap, catchError } from 'rxjs/operators'
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { WebSocketClient } from "./web-socket-client";
import { of } from "rxjs";

type Message = { type: string };

function isMessage(value: unknown): value is Message {
  return typeof value === 'object' && typeof (value as Message).type === 'string';
}

// const subject = webSocket('ws://localhost:8081');

// const observableA = subject.multiplex(
//   () => ({subscribe: 'A'}),
//   () => ({unsubscribe: 'A'}),
//   message => {
//     if(isMessage(message)) {
//       return message.type === 'A';
//     }
//     return false;
//   }
// );
 
// const observableB = subject.multiplex(
//   () => ({subscribe: 'B'}),
//   () => ({unsubscribe: 'B'}),
//   message => {
//     if(isMessage(message)) {
//       return message.type === 'B';
//     }
//     return false;
//   }
// );
 
// const subA = observableA.subscribe(messageForA => console.log(messageForA));
 
// const subB = observableB.subscribe(messageForB => console.log(messageForB));
 
// subB.unsubscribe();
 
// subA.unsubscribe();

const client = new WebSocketClient("ws://localhost", 8081);
// const observable = client.multiplex<Message>(
//   () => ("StartNotifyCommand"),
//   () => ("StopNotifyCommand"),
//   message => true,
// );
// const other = client.multiplex<Message>(
//   () => ("StartNotifyCommand"),
//   () => ("StopNotifyCommand"),
//   message => isMessage(message) ? message.type === 'A' : false,
// )

// const subscription = observable.subscribe(value => console.log(value));

// const othersub = other.subscribe(value => console.log(value.type));

const somethingCommand$ = client.connect("NotifySomethingCommand");
const sub = somethingCommand$.subscribe(message => console.log(message));

setTimeout(() => sub.unsubscribe(), 3000);

const sub2 = somethingCommand$.subscribe();
setTimeout(() => sub2.unsubscribe(), 10000);

// setTimeout(() => {
//   subscription.unsubscribe();

//   othersub.unsubscribe();  
// }, 1000);
