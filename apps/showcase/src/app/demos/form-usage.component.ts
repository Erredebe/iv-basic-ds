import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-form-usage',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <article class="showcase-demo-card showcase-demo-card--wide" aria-labelledby="forms-title">
      <h3 id="forms-title">Formulario con valueChange</h3>
      <p>Los eventos Stencil llegan a Angular como CustomEvent y actualizan estado local del componente.</p>
      <div class="showcase-form-grid">
        <iv-input
          label="Email de contacto"
          input-id="showcase-email"
          type="email"
          hint="Evento usado: valueChange"
          [value]="email"
          (valueChange)="updateEmail($event)"
        ></iv-input>
        <iv-textarea
          label="Mensaje"
          textarea-id="showcase-message"
          hint="El valor se sincroniza en el resumen Angular"
          [value]="message"
          [rows]="5"
          (valueChange)="updateMessage($event)"
        ></iv-textarea>
      </div>
      <div class="showcase-summary" aria-live="polite">
        <strong>Resumen Angular</strong>
        <span>{{ email }}</span>
        <span>{{ message }}</span>
      </div>
    </article>
  `,
})
export class FormUsageComponent {
  protected email = 'ana@example.com';
  protected message = 'Necesito validar los componentes dentro de una app Angular.';

  protected updateEmail(event: Event) {
    this.email = (event as CustomEvent<string>).detail;
  }

  protected updateMessage(event: Event) {
    this.message = (event as CustomEvent<string>).detail;
  }
}
