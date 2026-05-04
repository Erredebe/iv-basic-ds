import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-showcase-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="showcase-hero" aria-labelledby="showcase-title">
      <p class="showcase-kicker">IV Basic DS + Angular</p>
      <h1 id="showcase-title">Implementacion de los Web Components en un proyecto Angular</h1>
      <p>
        Esta app consume el bundle CDN agregado del design system, registra los custom elements y muestra patrones de uso
        pensados para equipos Angular.
      </p>
      <div class="showcase-actions">
        <iv-button href="#angular-usage" variant="primary">Ver implementacion Angular</iv-button>
        <iv-button href="#component-history" variant="secondary">Ver historico</iv-button>
        <iv-button href="/storybook/" variant="ghost">Storybook</iv-button>
      </div>
    </section>
  `,
})
export class ShowcaseHeroComponent {}
