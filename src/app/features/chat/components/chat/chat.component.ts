import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
  ViewEncapsulation
} from "@angular/core";
import { Store } from "@ngxs/store";
import { ChatState } from "../../state/chat.state";
import { ChatActions } from "../../state/chat.actions";
import { FormsModule } from "@angular/forms";
import { MessageComponent } from "../message/message.component";
import { InputAreaComponent } from "../input-area/input-area.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat' },
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    InputAreaComponent
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  private scrollContainer = viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

  private readonly _store = inject(Store);

  messages$ = this._store.select(ChatState.messages);
  connected$ = this._store.select(ChatState.isConnected);
  currentUser$ = this._store.select(ChatState.currentUser);
  typingUsers$ = this._store.select(ChatState.typingUsers);

  ngOnInit(): void {
    this._store.dispatch(new ChatActions.ConnectToChat());
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ChatActions.CloseConnection());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer().nativeElement.scrollTop = this.scrollContainer()?.nativeElement.scrollHeight;
  }
}
