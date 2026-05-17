import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { supportedVersions } from '../data/history-viewer.data';

@Component({
  selector: 'app-history-viewer',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './history-viewer.component.html',
})
export class HistoryViewerComponent {
  protected readonly selected = this.findSelectedVersion();
  protected clickCount = 0;
  protected lastAction = 'Sin interacciones todavia';

  protected registerClick(label: string) {
    this.clickCount += 1;
    this.lastAction = label;
  }

  private findSelectedVersion() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get('component');
    const version = params.get('version');

    return supportedVersions.find(item => item.component === component && item.version === version);
  }
}
