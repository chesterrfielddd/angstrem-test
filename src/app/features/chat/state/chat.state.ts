import { State, Action, Selector } from '@ngxs/store';
import { ChatApiService } from '../services/chat-api.service';
import { tap } from 'rxjs/operators';
import { ChatActions } from './chat.actions';
import { inject, Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import type { IChatStateModel } from '../models/chat-state.interface';
import { IMessage } from '../models/message.interface';

@Injectable({ providedIn: 'root' })
@State<IChatStateModel>({
  name: 'chat',
  defaults: {
    messages: [],
    connected: false,
    currentUser: '',
    typingUsers: []
  }
})
export class ChatState {
  private readonly _api = inject(ChatApiService);

  @Selector()
  static messages(state: IChatStateModel) {
    return state.messages;
  }

  @Selector()
  static isConnected(state: IChatStateModel) {
    return state.connected;
  }

  @Selector()
  static currentUser(state: IChatStateModel) {
    return state.currentUser;
  }

  @Selector()
  static typingUsers(state: IChatStateModel) {
    return state.typingUsers;
  }

  @Action(ChatActions.SetUser)
  setUser(ctx: StateContext<IChatStateModel>, { username }: ChatActions.SetUser) {
    ctx.patchState({ currentUser: username });
  }

  @Action(ChatActions.ConnectToChat)
  connect(ctx: StateContext<IChatStateModel>) {
    ctx.patchState({
      connected: true
    })
    return this._api.connect().pipe(
      tap(msg => ctx.dispatch(new ChatActions.ReceiveMessage(msg)))
    );
  }

  @Action(ChatActions.ReceiveMessage)
  receive(ctx: StateContext<IChatStateModel>, { payload }: ChatActions.ReceiveMessage) {
    const state = ctx.getState();

    if (payload.type === 'message') {
      ctx.patchState({
        messages: [...state.messages, payload]
      });
    } else {
      if (payload.isTyping) {
        const updatedTypingUsers = [...state.typingUsers, payload.user]

        ctx.patchState({
          typingUsers: updatedTypingUsers
        })
      } else {
        const updatedTypingUsers = state.typingUsers;
        updatedTypingUsers.splice(state.typingUsers.indexOf(payload.user), 1);

        ctx.patchState({
          typingUsers: [...updatedTypingUsers]
        })
      }
    }
  }

  @Action(ChatActions.SendMessage)
  sendMessage(ctx: StateContext<IChatStateModel>, { payload }: ChatActions.SendMessage) {
    const state = ctx.getState();

    const message: IMessage = {
      author: state.currentUser,
      text: payload,
      timestamp: Date.now(),
      type: 'message'
    };

    ctx.patchState({
      messages: [...state.messages, message]
    });
    this._api.sendMessage(message);
  }

  @Action(ChatActions.SendTypingData)
  sendTypingData(ctx: StateContext<IChatStateModel>, { isTyping }: ChatActions.SendTypingData): void {
    const { currentUser } = ctx.getState();

    this._api.sendTypingData({ user: currentUser, isTyping: isTyping, type: 'typingState' });
  }

  @Action(ChatActions.CloseConnection)
  closeConnection(): void {
    this._api.closeConnection();
  }

  @Action(ChatActions.HandleError)
  handleError(ctx: StateContext<IChatStateModel>): void {
    ctx.patchState({
      connected: false
    })
  }
}
