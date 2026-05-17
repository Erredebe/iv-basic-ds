import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

loadDesignSystemAssets();

bootstrapApplication(AppComponent).catch(error => console.error(error));

function loadDesignSystemAssets() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'assets/iv-basic-ds/build/iv-basic-ds.css';
  document.head.append(stylesheet);

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'assets/iv-basic-ds/build/iv-basic-ds.esm.js';
  document.head.append(script);
}
