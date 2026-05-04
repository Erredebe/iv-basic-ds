import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-icon-usage',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <article class="showcase-demo-card" aria-labelledby="icons-title">
      <h3 id="icons-title">Iconos accesibles</h3>
      <p>Los iconos decorativos no reciben label; los informativos si exponen nombre accesible.</p>
      <div class="showcase-icon-row" aria-label="Estados disponibles">
        <iv-icon name="check" size="lg" label="Correcto"></iv-icon>
        <iv-icon name="info" size="lg" label="Informacion"></iv-icon>
        <iv-icon name="warning" size="lg" label="Advertencia"></iv-icon>
        <iv-icon name="external-link" size="lg" aria-hidden="true"></iv-icon>
      </div>
    </article>
  `,
})
export class IconUsageComponent {}
