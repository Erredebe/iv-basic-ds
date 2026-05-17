import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';

import type { FeedbackState, IvDialogElement } from '../models/showcase.models';

@Component({
  selector: 'app-dialog-usage',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <article class="showcase-demo-card showcase-demo-card--wide" aria-labelledby="dialog-title">
      <h3 id="dialog-title">Dialog con API publica</h3>
      <p>El template usa una referencia Angular y el componente invoca los metodos publicos del custom element.</p>
      <iv-button variant="primary" (click)="openFeedbackDialog()">Abrir dialog</iv-button>
      <p class="showcase-status" aria-live="polite" aria-atomic="true">
        Ultimo cierre: <strong>{{ lastDialogReturnValue }}</strong>
      </p>
      <iv-dialog
        #feedbackDialog
        labelled-by="feedback-dialog-title"
        described-by="feedback-dialog-description"
        initial-focus="#feedback-cancel"
        (ivClose)="handleDialogClose($event)"
      >
        <h4 id="feedback-dialog-title" slot="header">Enviar feedback</h4>
        <p id="feedback-dialog-description">
          Este modal se abre desde Angular con <code>showModal()</code> y sus acciones slotted se cierran con <code>iv-dialog-close</code>.
        </p>
        <div slot="footer" class="showcase-inline-actions showcase-inline-actions--end">
          <iv-dialog-close id="feedback-cancel" return-value="cancelled">
            <iv-button variant="secondary">Cancelar</iv-button>
          </iv-dialog-close>
          <iv-dialog-close return-value="sent">
            <iv-button variant="primary">Enviar</iv-button>
          </iv-dialog-close>
        </div>
      </iv-dialog>
      <p class="showcase-status">
        Estado calculado: <strong>{{ feedbackState }}</strong>
      </p>
    </article>
  `,
})
export class DialogUsageComponent {
  @ViewChild('feedbackDialog') private feedbackDialog?: ElementRef<IvDialogElement>;

  protected feedbackState: FeedbackState = 'idle';
  protected lastDialogReturnValue = 'Sin interacciones todavia';

  protected openFeedbackDialog() {
    this.feedbackDialog?.nativeElement.showModal();
  }

  protected handleDialogClose(event: Event) {
    const returnValue = (event as CustomEvent<{ returnValue: string }>).detail.returnValue || 'closed';

    this.feedbackState = returnValue === 'sent' ? 'sent' : 'cancelled';
    this.lastDialogReturnValue = returnValue;
  }
}
