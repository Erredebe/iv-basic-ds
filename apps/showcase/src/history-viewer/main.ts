import { bootstrapApplication } from '@angular/platform-browser';

import { HistoryViewerComponent } from './viewer/history-viewer.component';

const params = new URLSearchParams(window.location.search);
const component = params.get('component') || '';
const version = params.get('version') || '';

void loadVersionedAssets(component, version).finally(() => {
  bootstrapApplication(HistoryViewerComponent).catch(error => console.error(error));
});

function loadVersionedAssets(component: string, version: string) {
  if (!component || !version) {
    return Promise.resolve();
  }

  appendStylesheet('/build/iv-basic-ds.css');
  appendStylesheet(`/components/${component}/${version}/build/${component}.css`);

  return appendModuleScript(`/components/${component}/${version}/build/${component}.esm.js`);
}

function appendStylesheet(href: string) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.append(stylesheet);
}

function appendModuleScript(src: string) {
  return new Promise<void>(resolve => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.append(script);
  });
}
