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
});
