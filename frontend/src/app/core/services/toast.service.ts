import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);
  private counter = 0;

  readonly messages = this._messages.asReadonly();

  show(text: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const id = ++this.counter;
    this._messages.set([...this._messages(), { id, text, type }]);
    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: number): void {
    this._messages.set(this._messages().filter((m) => m.id !== id));
  }
}
