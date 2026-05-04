import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';

type FeedbackState = 'idle' | 'sent' | 'cancelled';

interface ComponentVersion {
  version: string;
  status: string;
  releaseNotes: string;
  demoUrl: string;
  cdnUrl: string;
}

interface ComponentHistory {
  name: string;
  tag: string;
  level: string;
  description: string;
  versions: ComponentVersion[];
}

type IvDialogElement = HTMLElement & {
  showModal: () => Promise<void>;
  close: (returnValue?: string) => Promise<void>;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('feedbackDialog') private feedbackDialog?: ElementRef<IvDialogElement>;

  protected readonly currentComponents = [
    { name: 'Button', tag: 'iv-button', level: 'Atom', summary: 'Acciones nativas y enlaces con variantes visuales.' },
    { name: 'Icon', tag: 'iv-icon', level: 'Atom', summary: 'Iconografia SVG decorativa o con nombre accesible.' },
    { name: 'Input', tag: 'iv-input', level: 'Atom', summary: 'Campo de texto con label, ayuda, error y eventos.' },
    { name: 'Textarea', tag: 'iv-textarea', level: 'Atom', summary: 'Entrada multilínea con estado, ayuda y validacion visual.' },
    { name: 'Dialog', tag: 'iv-dialog', level: 'Molecule', summary: 'Modal nativo con API publica y eventos Stencil.' },
  ];

  protected readonly histories: ComponentHistory[] = [
    {
      name: 'Button',
      tag: 'iv-button',
      level: 'Atoms',
      description: 'Historico versionado del boton publicado por CDN.',
      versions: [
        {
          version: '0.0.1',
          status: 'Inicial',
          releaseNotes: 'Primer bundle publico con variantes primary, secondary, ghost y disabled.',
          demoUrl: 'history/iv-button/0.0.1/index.html',
          cdnUrl: '/components/iv-button/0.0.1/build/iv-button.esm.js',
        },
        {
          version: '0.0.2',
          status: 'Actual',
          releaseNotes: 'Agrega la variante danger y mantiene la API publica del boton.',
          demoUrl: 'history/iv-button/0.0.2/index.html',
          cdnUrl: '/components/iv-button/0.0.2/build/iv-button.esm.js',
        },
      ],
    },
    {
      name: 'Icon',
      tag: 'iv-icon',
      level: 'Atoms',
      description: 'Sin versiones historicas publicadas todavia.',
      versions: [],
    },
    {
      name: 'Input',
      tag: 'iv-input',
      level: 'Atoms',
      description: 'Sin versiones historicas publicadas todavia.',
      versions: [],
    },
    {
      name: 'Textarea',
      tag: 'iv-textarea',
      level: 'Atoms',
      description: 'Sin versiones historicas publicadas todavia.',
      versions: [],
    },
    {
      name: 'Dialog',
      tag: 'iv-dialog',
      level: 'Molecules',
      description: 'Sin versiones historicas publicadas todavia.',
      versions: [],
    },
  ];

  protected email = 'ana@example.com';
  protected message = 'Necesito validar los componentes dentro de una app Angular.';
  protected notificationsEnabled = true;
  protected feedbackState: FeedbackState = 'idle';
  protected lastDialogReturnValue = 'Sin interacciones todavia';

  protected updateEmail(event: Event) {
    this.email = (event as CustomEvent<string>).detail;
  }

  protected updateMessage(event: Event) {
    this.message = (event as CustomEvent<string>).detail;
  }

  protected toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  protected openFeedbackDialog() {
    void this.feedbackDialog?.nativeElement.showModal();
  }

  protected closeFeedbackDialog(returnValue: FeedbackState) {
    void this.feedbackDialog?.nativeElement.close(returnValue);
  }

  protected handleDialogClose(event: Event) {
    const returnValue = (event as CustomEvent<{ returnValue: string }>).detail.returnValue || 'closed';

    this.feedbackState = returnValue === 'sent' ? 'sent' : 'cancelled';
    this.lastDialogReturnValue = returnValue;
  }

  protected historyAnchor(history: ComponentHistory) {
    return `history-${history.tag}`;
  }
}
