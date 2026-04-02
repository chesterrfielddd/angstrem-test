export interface IMessage {
  id?: string;
  author: string;
  text: string;
  timestamp: number;
  type: 'message';
}