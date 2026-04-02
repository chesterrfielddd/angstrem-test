import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Store } from "@ngxs/store";
import { BehaviorSubject, distinctUntilChanged } from "rxjs";
import { ChatActions } from "../../state/chat.actions";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrl: './input-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'input-area' },
  imports: [
    FormsModule
  ]
})
export class InputAreaComponent implements OnInit, OnDestroy {
  messageText = '';
  private typingSubject$$ = new BehaviorSubject<boolean>(false);
  private typingTimer: any;

  private readonly _store = inject(Store);

  ngOnInit(): void {
    this.typingSubject$$.pipe(distinctUntilChanged())
      .subscribe((value) => this.updateTyping(value));
  }

  ngOnDestroy(): void {
    this.typingSubject$$.unsubscribe();
  }

  onTyping(): void {
    this.typingSubject$$.next(true);

    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
      this.typingSubject$$.next(false);
    }, 1000);
  }

  send(): void {
    if (this.messageText.trim()) {
      this._store.dispatch(new ChatActions.SendMessage(this.messageText));
      this.messageText = '';
    }
  }

  private updateTyping(isTyping: boolean): void {
    this._store.dispatch(new ChatActions.SendTypingData(isTyping));
  }
}