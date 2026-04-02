import { 
  ChangeDetectionStrategy, 
  Component, 
  inject, 
  input, 
  InputSignal, 
  ViewEncapsulation 
} from "@angular/core";
import { IMessage } from "../../models/message.interface";
import { CommonModule } from "@angular/common";
import { Store } from "@ngxs/store";
import { ChatState } from "../../state/chat.state";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'message' },
  imports: [
    CommonModule
  ]
})
export class MessageComponent {
  readonly message: InputSignal<IMessage> = input.required<IMessage>();

  private readonly _store = inject(Store);

  readonly currentUser$ = this._store.select(ChatState.currentUser);
}