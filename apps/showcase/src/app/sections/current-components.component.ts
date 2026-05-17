import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { currentComponents } from '../data/showcase.data';

@Component({
  selector: 'app-current-components',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="showcase-section" aria-labelledby="current-components-title">
      <div class="showcase-section__header">
        <p class="showcase-kicker">Bundle actual</p>
        <h2 id="current-components-title">Componentes disponibles</h2>
        <p>Referencia rapida de los tags registrados por el bundle agregado que consume la app.</p>
      </div>
      <div class="showcase-card-grid">
        <article class="showcase-card" *ngFor="let component of components">
          <p class="showcase-card__eyebrow">{{ component.level }}</p>
          <h3>{{ component.name }}</h3>
          <p>{{ component.summary }}</p>
          <code>{{ component.tag }}</code>
        </article>
      </div>
    </section>
  `,
})
export class CurrentComponentsComponent {
  protected readonly components = currentComponents;
}
