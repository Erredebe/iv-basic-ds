import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-showcase-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="showcase-hero" aria-labelledby="showcase-title">
      <p class="showcase-kicker">Showcase Angular</p>
      <h1 id="showcase-title">Casos de uso con IV Basic DS</h1>
      <p>
        Ejemplos reales de consumo de Web Components Stencil desde Angular: bindings, eventos, formularios, dialog y versionado.
      </p>
      <nav class="showcase-actions" aria-label="Navegacion principal del showcase">
        <iv-button href="#angular-usage" variant="primary">Ver casos de uso</iv-button>
        <iv-button href="#component-history" variant="secondary">Ver historico</iv-button>
        <iv-button href="/storybook/" variant="ghost">Storybook</iv-button>
      </nav>
    </section>
  `,
})
export class ShowcaseHeroComponent {}
