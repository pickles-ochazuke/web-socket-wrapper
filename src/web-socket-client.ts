import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Observable } from "rxjs/internal/Observable";
import { publish, refCount } from "rxjs/operators";
import { ConnectableObservable } from "rxjs";

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

  private subject$: WebSocketSubject<unknown>;

  get observable$(): Observable<unknown> {
    return this.subject$.asObservable();
  }

  constructor(url: string, port: number) {
    this.subject$ = webSocket(`${url}:${port}`);
  }

  private multiplex<T>(subscribe: () => any, unsubscribe: () => any, filter: (value: unknown) => boolean): Observable<T> {
    return this.subject$.multiplex(subscribe, unsubscribe, filter);
  }

  connect(commandName: string): Observable<CommandObject> {
    const startFn = () => `Start${commandName}`;
    const stopFn = () => `Stop${commandName}`;
    
    const isFunc = this.generateIs(commandName); 
    const filterFn = (message: unknown) => isCommandObject(message) ? message.Command === commandName : false;

    return this.multiplex(startFn, stopFn, filterFn).pipe(publish(), refCount());
  }

  private generateIs<T extends CommandObject>(command: string): (value: unknown) => value is T {
    
    return ((value: unknown): value is T => {
      return (typeof value === 'object') && (typeof (value as T).Command === command);
    })
  }
}