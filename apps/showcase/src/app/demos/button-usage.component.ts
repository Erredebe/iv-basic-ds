import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-button-usage',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <article class="showcase-demo-card" aria-labelledby="buttons-title">
      <h3 id="buttons-title">Acciones con iv-button</h3>
      <p>Angular puede usar atributos estaticos, bindings de propiedades y eventos nativos del host.</p>
      <div class="showcase-inline-actions">
        <iv-button variant="primary" (click)="toggleNotifications()">
          {{ notificationsEnabled ? 'Desactivar avisos' : 'Activar avisos' }}
        </iv-button>
        <iv-button variant="secondary" href="/storybook/">Abrir docs</iv-button>
        <iv-button variant="danger" [disabled]="!notificationsEnabled">Accion critica</iv-button>
      </div>
      <p class="showcase-status" aria-live="polite" aria-atomic="true">
        Estado Angular: <strong>{{ notificationsEnabled ? 'avisos activos' : 'avisos pausados' }}</strong>
      </p>
    </article>
  `,
})
export class ButtonUsageComponent {
  protected notificationsEnabled = true;

  protected toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }
}
