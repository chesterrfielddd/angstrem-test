import { inject, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { first } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { IMessage } from "../models/message.interface";
import { ITypingUser } from "../models/typing-user.interface";
import { Store } from "@ngxs/store";
import { ChatActions } from "../state/chat.actions";
import { WebSocketMessageType } from "../models/websocket-message.type";

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private socket$: WebSocketSubject<WebSocketMessageType> | null = null;
  private readonly _store = inject(Store);
  
  private reconnectTimerId: any = null;
  private isManuallyClosed = false;
  private readonly RECONNECT_INTERVAL_MS = 3000;

  sendMessage(data: IMessage): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(data);
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  sendTypingData(data: ITypingUser): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(data);
    } else {
      console.warn('WebSocket not connected, typing data not sent');
    }
  }

  connect(): void {
    if (this.socket$ && !this.socket$.closed) return;
    this.isManuallyClosed = false;
    this.createConnection();
  }

  private createConnection(): void {
    this.socket$ = webSocket<WebSocketMessageType>({
      url: environment.API_URL,
    });

    this.socket$.subscribe({
      next: (serverMsg: WebSocketMessageType) => {
        if (serverMsg.type === 'message') {
          this._store.dispatch(new ChatActions.ReceiveMessage(serverMsg as IMessage));
        }
        if (serverMsg.type === 'typingState') {
          this._store.dispatch(new ChatActions.ReceiveTypingData(serverMsg as ITypingUser));
        }
      },
      error: (err) => {
        console.error('WebSocket error', err);
        this._store.dispatch(new ChatActions.SetConnected(false));
        this.handleDisconnection();
      },
      complete: () => {
        console.log('WebSocket closed');
        this._store.dispatch(new ChatActions.SetConnected(false));
        this.handleDisconnection();
      }
    });

    this.socket$.pipe(first()).subscribe({
      next: () => {
        console.log('WebSocket connected');
        this._store.dispatch(new ChatActions.SetConnected(true));
      }
    });
  }
  
  private handleDisconnection(): void {
    if (this.isManuallyClosed) return;
    
    if (this.reconnectTimerId) {
      clearTimeout(this.reconnectTimerId);
    }
    
    this.reconnectTimerId = setTimeout(() => {
      this.reconnectTimerId = null;
      console.log('Attempting to reconnect...');
      this.createConnection();
    }, this.RECONNECT_INTERVAL_MS);
  }

  closeConnection(): void {
    this.isManuallyClosed = true;

    if (this.reconnectTimerId) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }
    
    this.socket$?.complete();
    this.socket$ = null;
    this._store.dispatch(new ChatActions.SetConnected(false));
  }
}