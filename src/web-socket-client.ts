import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Observable } from "rxjs/internal/Observable";

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

  multiplex<T>(subscribe: () => any, unsubscribe: () => any, filter: (value: unknown) => boolean): Observable<T> {
    return this.subject$.multiplex(subscribe, unsubscribe, filter);
  }
}