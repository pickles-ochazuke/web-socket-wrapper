import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Observable } from "rxjs/internal/Observable";
import { publish, refCount } from "rxjs/operators";

export type CommandObject = {
  "Command": string,
  "Args": any
}

function isCommandObject(value: unknown): value is CommandObject {
  return typeof value === 'object' && typeof (value as CommandObject).Command === 'string';
}

/**
 * WebSocket通信の役割を持つ
 * WebSocketAPIはこのクラスを使って通信する。
 * multiplexを使うと自分のみたいイベントだけ取得できる
 * WebSocketの通知を開始する場合、同期的に行う必要がある
 */
export class WebSocketClient {

  private queue: Observable<any>[] = [];
  private subject$: WebSocketSubject<unknown>;
  
  constructor(url: string, port: number) {
    this.subject$ = webSocket({
      url: `${url}:${port}`,
      openObserver: {
        next: () => console.log('Websocket is Opened'),
        error: () => console.log('Websocket Opening is Error!')
      },
      closeObserver: {
        next: () => console.log('Websocket is Closed'),
        error: () => console.log('Websocket is Error')
      },
      closingObserver: {
        next: () => console.log('Websocket is Closing'),
        error: () => console.log('Websocket is Error')
      },
      
    });
  }

  close() {
    this.subject$.unsubscribe();
  }

  private multiplex<T>(subscribe: () => any, unsubscribe: () => any, filter: (value: unknown) => boolean): Observable<T> {
    return this.subject$.multiplex(subscribe, unsubscribe, filter);
  }

  connect(commandName: string): Observable<CommandObject> {
    const startFn = () => `Start${commandName}`;
    const stopFn = () => `Stop${commandName}`;
    
    const filterFn = (message: unknown) => isCommandObject(message) ? message.Command === commandName : false;

    return this.multiplex<CommandObject>(startFn, stopFn, filterFn).pipe(publish(), refCount());
  }
}