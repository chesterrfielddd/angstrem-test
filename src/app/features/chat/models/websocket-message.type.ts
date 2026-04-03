import { IMessage } from "./message.interface";
import { ITypingUser } from "./typing-user.interface";

export type WebSocketMessageType = IMessage | ITypingUser;