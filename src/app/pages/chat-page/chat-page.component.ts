import { Component, inject, ViewEncapsulation } from "@angular/core";
import { ChatComponent } from "../../features/chat/components/chat/chat.component";
import { Store } from "@ngxs/store";
import { ChatState } from "../../features/chat/state/chat.state";
import { AuthComponent } from "../../features/chat/components/auth/auth.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-page' },
  imports: [
    CommonModule, 
    ChatComponent, 
    AuthComponent
  ]
})
export class ChatPageComponent { 
  private readonly _store = inject(Store);

  readonly currentUser$ = this._store.select(ChatState.currentUser);
}