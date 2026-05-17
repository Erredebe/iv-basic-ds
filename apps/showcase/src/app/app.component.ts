import { Component } from '@angular/core';

import { AngularUsageComponent } from './sections/angular-usage.component';
import { ComponentHistoryComponent } from './sections/component-history.component';
import { CurrentComponentsComponent } from './sections/current-components.component';
import { ShowcaseHeroComponent } from './sections/showcase-hero.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShowcaseHeroComponent, CurrentComponentsComponent, AngularUsageComponent, ComponentHistoryComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
