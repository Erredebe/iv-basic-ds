import { Component } from '@angular/core';

import { ButtonUsageComponent } from '../demos/button-usage.component';
import { DialogUsageComponent } from '../demos/dialog-usage.component';
import { FormUsageComponent } from '../demos/form-usage.component';
import { IconUsageComponent } from '../demos/icon-usage.component';

@Component({
  selector: 'app-angular-usage',
  standalone: true,
  imports: [ButtonUsageComponent, IconUsageComponent, FormUsageComponent, DialogUsageComponent],
  template: `
    <section id="angular-usage" class="showcase-section" aria-labelledby="angular-usage-title">
      <div class="showcase-section__header">
        <p class="showcase-kicker">Uso Angular</p>
        <h2 id="angular-usage-title">Bindings, eventos y metodos publicos</h2>
      </div>

      <div class="showcase-demo-grid">
        <app-button-usage />
        <app-icon-usage />
        <app-form-usage />
        <app-dialog-usage />
      </div>
    </section>
  `,
})
export class AngularUsageComponent {}
