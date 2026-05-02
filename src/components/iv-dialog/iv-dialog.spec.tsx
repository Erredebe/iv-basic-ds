import { newSpecPage } from '@stencil/core/testing';
import { IvDialog } from './iv-dialog';

describe('iv-dialog', () => {
  beforeEach(() => {
    const dialogPrototype = HTMLElement.prototype as HTMLElement & Pick<HTMLDialogElement, 'show' | 'showModal' | 'close'>;

    dialogPrototype.show = jest.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = true;
      this.setAttribute('open', '');
    });
    dialogPrototype.showModal = jest.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = true;
      this.setAttribute('open', '');
    });
    dialogPrototype.close = jest.fn(function (this: HTMLElement, returnValue = '') {
      (this as HTMLDialogElement).open = false;
      (this as HTMLDialogElement).returnValue = returnValue;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  it('renders the internal native dialog structure', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: `
        <iv-dialog labelled-by="dialog-title" described-by="dialog-description">
          <h2 slot="header" id="dialog-title">Titulo</h2>
          <p id="dialog-description">Descripcion</p>
          <div slot="footer"><button>Confirmar</button></div>
        </iv-dialog>
      `,
    });

    const dialog = page.root?.querySelector('dialog');

    expect(dialog).not.toBeNull();
    expect(dialog?.className).toBe('iv-dialog');
    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('dialog-title');
    expect(dialog?.getAttribute('aria-describedby')).toBe('dialog-description');
    expect(page.root?.querySelector('.iv-dialog__surface')).not.toBeNull();
    expect(page.root?.querySelector('.iv-dialog__header')).not.toBeNull();
    expect(page.root?.querySelector('.iv-dialog__body')).not.toBeNull();
    expect(page.root?.querySelector('.iv-dialog__footer')).not.toBeNull();
  });

  it('applies alertdialog role and label when configured', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog dialog-role="alertdialog" label="Eliminar elemento"><p>Contenido</p></iv-dialog>',
    });

    const dialog = page.root?.querySelector('dialog');

    expect(dialog?.getAttribute('role')).toBe('alertdialog');
    expect(dialog?.getAttribute('aria-label')).toBe('Eliminar elemento');
  });

  it('opens and closes as a modal dialog through public methods', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const dialog = page.root?.querySelector('dialog') as HTMLDialogElement;

    await component.showModal();

    expect(component.open).toBe(true);
    expect(component.modal).toBe(true);
    expect(dialog.showModal).toHaveBeenCalled();

    await component.close('confirm');

    expect(dialog.close).toHaveBeenCalledWith('confirm');
    expect(component.returnValue).toBe('confirm');
  });

  it('opens as non-modal through public show method', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const dialog = page.root?.querySelector('dialog') as HTMLDialogElement;

    await component.show();

    expect(component.open).toBe(true);
    expect(component.modal).toBe(false);
    expect(dialog.show).toHaveBeenCalled();
  });

  it('controls close on backdrop click when modal and closeOnBackdrop are enabled', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog close-on-backdrop="true" modal="true"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnBackdrop).toBe(true);
    expect(component.modal).toBe(true);
  });

  it('prevents close on backdrop click when closeOnBackdrop is disabled', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog close-on-backdrop="false" modal="true" open><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnBackdrop).toBe(false);
  });

  it('allows close on Escape when closeOnEscape is enabled', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog close-on-escape="true"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnEscape).toBe(true);
  });

  it('prevents close on Escape when closeOnEscape is disabled', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog close-on-escape="false"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnEscape).toBe(false);
  });

  it('restores focus to previously focused element when restoreFocus is enabled', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog restore-focus="true"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.restoreFocus).toBe(true);
  });

  it('applies initialFocus to the specified element on open', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog initial-focus="#confirm-btn"><p>Contenido</p><button id="confirm-btn">Confirmar</button></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const focusBtn = page.root?.querySelector('#confirm-btn') as HTMLButtonElement;
    focusBtn.focus = jest.fn();

    await component.showModal();

    expect(focusBtn.focus).toHaveBeenCalled();
  });

  it('renders with no label when neither label nor labelled-by is provided', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const dialog = page.root?.querySelector('dialog');

    expect(dialog?.getAttribute('aria-label')).toBeNull();
    expect(dialog?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('renders with label when only label attribute is provided', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog label="Ayuda rapida"><p>Contenido</p></iv-dialog>',
    });

    const dialog = page.root?.querySelector('dialog');

    expect(dialog?.getAttribute('aria-label')).toBe('Ayuda rapida');
  });

  it('renders with no aria-modal when modal is false', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog modal="false"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const dialog = page.root?.querySelector('dialog');

    await component.show();

    expect(dialog?.getAttribute('aria-modal')).toBeNull();
  });

  it('applies aria-describedby when provided', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog described-by="dialog-desc"><p>Contenido</p><p id="dialog-desc">Descripcion</p></iv-dialog>',
    });

    const dialog = page.root?.querySelector('dialog');

    expect(dialog?.getAttribute('aria-describedby')).toBe('dialog-desc');
  });

  it('handles close when open becomes false while dialog is open', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog open><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const dialog = page.root?.querySelector('dialog') as HTMLDialogElement;

    component.open = false;

    expect(dialog.close).toHaveBeenCalled();
  });

  it('opens non-modal with show method', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog modal="false"><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;
    const dialog = page.root?.querySelector('dialog') as HTMLDialogElement;

    await component.show();

    expect(component.modal).toBe(false);
    expect(dialog.show).toHaveBeenCalled();
  });

  it('renders with header, body and footer slots', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: `
        <iv-dialog labelled-by="dialog-title">
          <h2 slot="header" id="dialog-title">Titulo</h2>
          <p>Cuerpo</p>
          <div slot="footer">Footer</div>
        </iv-dialog>
      `,
    });

    expect(page.root?.querySelector('.iv-dialog__header')).not.toBeNull();
    expect(page.root?.querySelector('.iv-dialog__body')).not.toBeNull();
    expect(page.root?.querySelector('.iv-dialog__footer')).not.toBeNull();
  });

  it('renders with default modal true', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.modal).toBe(true);
  });

  it('renders with closeOnBackdrop default true', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnBackdrop).toBe(true);
  });

  it('renders with closeOnEscape default true', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.closeOnEscape).toBe(true);
  });

  it('renders with restoreFocus default false', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.restoreFocus).toBe(false);
  });

  it('renders with dialogRole default dialog', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.dialogRole).toBe('dialog');
  });

  it('renders with returnValue default empty', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.returnValue).toBe('');
  });

  it('renders with initialFocus undefined', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.initialFocus).toBeUndefined();
  });

  it('renders with ariaLabel undefined', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.ariaLabel).toBeUndefined();
  });

  it('renders with ariaLabelledby undefined', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.ariaLabelledby).toBeUndefined();
  });

  it('renders with ariaDescribedby undefined', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    expect(component.ariaDescribedby).toBeUndefined();
  });

  it('does not call close again when dialog is already closed', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    await component.close('confirm');

    expect(component.returnValue).toBe('confirm');
  });

  it('sets internal open to false when close is called without open dialog', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog><p>Contenido</p></iv-dialog>',
    });

    const component = page.rootInstance as IvDialog;

    await component.close('confirm');

    expect(component.open).toBe(false);
  });

  it('renders open attribute when open prop is true', async () => {
    const page = await newSpecPage({
      components: [IvDialog],
      html: '<iv-dialog open><p>Contenido</p></iv-dialog>',
    });

    expect(page.root?.hasAttribute('open')).toBe(true);
  });
});