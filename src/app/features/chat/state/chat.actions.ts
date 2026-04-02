import { IMessage } from "../models/message.interface";
import { ITypingUser } from "../models/typing-user.interface";

export namespace ChatActions {
  export class ConnectToChat {
    static readonly type = '[Chat] Connect';
  }

  export class SendMessage {
    static readonly type = '[Chat] Send Message';
    constructor(readonly payload: string) { }
  }

  export class SetUser {
    static readonly type = '[Chat] Set User';
    constructor(readonly username: string) { }
  }

  export class ReceiveMessage {
    static readonly type = '[Chat] Receive Message';
    constructor(readonly payload: IMessage | ITypingUser) { }
  }

  export class SendTypingData {
    static readonly type = '[Chat] Send Typing Data';
    constructor(readonly isTyping: boolean) { };
  }

  export class CloseConnection {
    static readonly type = '[Chat] Close Connection';
  }

  export class HandleError {
    static readonly type = '[Chat] Error';
  }
}