import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { Store } from "@ngxs/store";
import { ChatActions } from "../../state/chat.actions";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'auth' },
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AuthComponent {
  name: string = '';

  private readonly _store = inject(Store);

  login(name: string) {
    if (name.trim()) {
      this._store.dispatch(new ChatActions.SetUser(name));
    }
  }
}