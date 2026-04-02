import { inject, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, retry } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { IMessage } from "../models/message.interface";
import { ITypingUser } from "../models/typing-user.interface";
import { Store } from "@ngxs/store";
import { ChatActions } from "../state/chat.actions";

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private socket$: WebSocketSubject<any>;

  private readonly _store = inject(Store);

  constructor() {
    this.socket$ = webSocket({
      url: environment.API_URL,
      openObserver: {
        next: () => console.log('WS Connected'),
        error: () => this._store.dispatch(new ChatActions.HandleError())  //TODO: переделать, не срабатывает
       }
    });
  }

  sendMessage(data: IMessage): void {
    this.socket$.next(data);
  }

  sendTypingData(data: ITypingUser): void {
    this.socket$.next(data);
  }

  connect(): Observable<any> {
    return this.socket$.asObservable().pipe(
      retry({
        delay: 3000,
        resetOnSuccess: true
      })
    )
  }

  closeConnection(): void {
    this.socket$.complete();
  }
}