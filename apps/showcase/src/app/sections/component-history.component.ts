import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { componentHistories } from '../data/showcase.data';
import type { ComponentHistory } from '../models/showcase.models';

@Component({
  selector: 'app-component-history',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section id="component-history" class="showcase-section showcase-section--history" aria-labelledby="history-title">
      <div class="showcase-section__header">
        <p class="showcase-kicker">Historico de componentes</p>
        <h2 id="history-title">Versiones publicadas por componente</h2>
        <p>
          Cada version se renderiza en un viewer Angular aislado para evitar conflictos al registrar multiples bundles con el mismo tag.
        </p>
      </div>

      <nav class="showcase-history-nav" aria-label="Componentes con historico">
        <iv-button *ngFor="let history of histories" [href]="'#' + historyAnchor(history)" variant="secondary">
          {{ history.name }}
        </iv-button>
      </nav>

      <article class="showcase-history" *ngFor="let history of histories" [id]="historyAnchor(history)">
        <div class="showcase-history__heading">
          <div>
            <p class="showcase-card__eyebrow">{{ history.level }}</p>
            <h3>{{ history.name }}</h3>
            <p>{{ history.description }}</p>
          </div>
          <code>{{ history.tag }}</code>
        </div>

        <div class="showcase-empty" *ngIf="history.versions.length === 0">
          Aun no hay bundles historicos publicados para este componente.
        </div>

        <div class="showcase-version-list" *ngIf="history.versions.length > 0">
          <section class="showcase-version" *ngFor="let version of history.versions" [attr.aria-labelledby]="history.tag + '-' + version.version">
            <div class="showcase-version__meta">
              <p class="showcase-card__eyebrow">{{ version.status }}</p>
              <h4 [id]="history.tag + '-' + version.version">{{ history.tag }} {{ version.version }}</h4>
              <p>{{ version.releaseNotes }}</p>
              <p class="showcase-code-label">CDN</p>
              <code>{{ version.cdnUrl }}</code>
              <div class="showcase-inline-actions">
                <iv-button [href]="version.demoUrl" variant="secondary" target="_blank">Abrir demo aislada en nueva pestana</iv-button>
              </div>
            </div>
            <iframe class="showcase-version__frame" [title]="'Demo Angular aislada de ' + history.tag + ' version ' + version.version" [attr.src]="version.demoUrl"></iframe>
          </section>
        </div>
      </article>
    </section>
  `,
})
export class ComponentHistoryComponent {
  protected readonly histories = componentHistories;

  protected historyAnchor(history: ComponentHistory) {
    return `history-${history.tag}`;
  }
}
