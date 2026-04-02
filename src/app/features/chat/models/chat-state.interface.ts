import { IMessage } from "./message.interface";

export interface IChatStateModel {
  messages: IMessage[];
  connected: boolean;
  currentUser: string;
  typingUsers: string[];
}