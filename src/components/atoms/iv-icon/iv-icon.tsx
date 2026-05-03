import { Component, Host, Prop, h } from '@stencil/core';

const paths = {
  check: <path d="M7.6 15.2 3.8 11.4l-1.4 1.4 5.2 5.2 14-14-1.4-1.4L7.6 15.2Z" />,
  close: <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />,
  info: (
    <g>
      <path d="M11 10h2v8h-2v-8Z" />
      <path d="M11 6h2v2h-2V6Z" />
      <path
        fill-rule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"
        clip-rule="evenodd"
      />
    </g>
  ),
  warning: (
    <g>
      <path d="M11 9h2v5h-2V9Z" />
      <path d="M11 16h2v2h-2v-2Z" />
      <path
        fill-rule="evenodd"
        d="M12 3 1.7 21h20.6L12 3Zm0 4.02L18.84 19H5.16L12 7.02Z"
        clip-rule="evenodd"
      />
    </g>
  ),
  'chevron-down': <path d="m12 15.4-7-7L6.4 7l5.6 5.6L17.6 7 19 8.4l-7 7Z" />,
  'external-link': (
    <g>
      <path d="M14 3h7v7h-2V6.41l-8.3 8.3-1.4-1.42 8.29-8.29H14V3Z" />
      <path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z" />
    </g>
  ),
} as const;

export type IvIconName = keyof typeof paths;

@Component({
  tag: 'iv-icon',
  styleUrl: 'iv-icon.css',
  shadow: false,
})
export class IvIcon {
  /** Nombre del icono a renderizar. */
  @Prop() name!: IvIconName;

  /** Tamano visual del icono. */
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  /** Nombre accesible cuando el icono transmite significado por si mismo. */
  @Prop({ reflect: true }) label?: string;

  render() {
    const iconPath = paths[this.name];
    const isDecorative = !this.label;

    return (
      <Host>
        <svg
          class={`iv-icon iv-icon--${this.size}`}
          viewBox="0 0 24 24"
          aria-hidden={isDecorative ? 'true' : undefined}
          aria-label={this.label}
          role={isDecorative ? undefined : 'img'}
          focusable="false"
        >
          {iconPath}
        </svg>
      </Host>
    );
  }
}
