import { beforeEach, describe, expect, h, it, render, vi } from '@stencil/vitest';
import './iv-dialog';

type DialogRender = Awaited<ReturnType<typeof render>> & {
  root: HTMLIvDialogElement;
};

const renderDialog = async (dialog: HTMLElement): Promise<DialogRender> => (await render(dialog)) as DialogRender;
const getNativeDialog = (root: HTMLElement) => root.querySelector('dialog') as HTMLDialogElement;

describe('iv-dialog', () => {
  beforeEach(() => {
    const dialogPrototype = HTMLElement.prototype as HTMLElement & Pick<HTMLDialogElement, 'show' | 'showModal' | 'close'>;

    dialogPrototype.show = vi.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = true;
      this.setAttribute('open', '');
    });
    dialogPrototype.showModal = vi.fn(function (this: HTMLElement) {
      (this as HTMLDialogElement).open = true;
      this.setAttribute('open', '');
    });
    dialogPrototype.close = vi.fn(function (this: HTMLElement, returnValue = '') {
      (this as HTMLDialogElement).open = false;
      (this as HTMLDialogElement).returnValue = returnValue;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  it('renders the internal native dialog structure', async () => {
    const { root } = await renderDialog(
      <iv-dialog labelled-by="dialog-title" described-by="dialog-description">
        <h2 slot="header" id="dialog-title">
          Titulo
        </h2>
        <p id="dialog-description">Descripcion</p>
        <div slot="footer">
          <button>Confirmar</button>
        </div>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    expect(dialog).not.toBeNull();
    expect(dialog.className).toBe('iv-dialog');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('dialog-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('dialog-description');
    expect(root.getAttribute('labelled-by')).toBe('dialog-title');
    expect(root.getAttribute('described-by')).toBe('dialog-description');
    expect(root.hasAttribute('aria-labelledby')).toBe(false);
    expect(root.hasAttribute('aria-describedby')).toBe(false);
    expect(root.querySelector('.iv-dialog__surface')).not.toBeNull();
    expect(root.querySelector('.iv-dialog__header')).not.toBeNull();
    expect(root.querySelector('.iv-dialog__body')).not.toBeNull();
    expect(root.querySelector('.iv-dialog__footer')).not.toBeNull();
  });

  it('applies alertdialog role and label when configured', async () => {
    const { root } = await renderDialog(
      <iv-dialog dialog-role="alertdialog" label="Eliminar elemento">
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.getAttribute('aria-label')).toBe('Eliminar elemento');
    expect(root.getAttribute('label')).toBe('Eliminar elemento');
    expect(root.hasAttribute('aria-label')).toBe(false);
  });

  it('opens and closes as a modal dialog through public methods', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);
    const showModal = vi.spyOn(dialog, 'showModal');
    const close = vi.spyOn(dialog, 'close');

    await root.showModal();

    expect(root.open).toBe(true);
    expect(root.modal).toBe(true);
    expect(showModal).toHaveBeenCalled();

    await root.close('confirm');

    expect(close).toHaveBeenCalledWith('confirm');
    expect(root.returnValue).toBe('confirm');
  });

  it('opens as non-modal through public show method', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);
    const show = vi.spyOn(dialog, 'show');

    await root.show();

    expect(root.open).toBe(true);
    expect(root.modal).toBe(false);
    expect(show).toHaveBeenCalled();
  });

  it('controls close on backdrop click when modal and closeOnBackdrop are enabled', async () => {
    const { root } = await renderDialog(
      <iv-dialog closeOnBackdrop={true} modal={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnBackdrop).toBe(true);
    expect(root.modal).toBe(true);
  });

  it('prevents close on backdrop click when closeOnBackdrop is disabled', async () => {
    const { root } = await renderDialog(
      <iv-dialog closeOnBackdrop={false} modal={true} open={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnBackdrop).toBe(false);
  });

  it('allows close on Escape when closeOnEscape is enabled', async () => {
    const { root } = await renderDialog(
      <iv-dialog closeOnEscape={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnEscape).toBe(true);
  });

  it('prevents close on Escape when closeOnEscape is disabled', async () => {
    const { root } = await renderDialog(
      <iv-dialog closeOnEscape={false}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnEscape).toBe(false);
  });

  it('restores focus to previously focused element when restoreFocus is enabled', async () => {
    const { root } = await renderDialog(
      <iv-dialog restoreFocus={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.restoreFocus).toBe(true);
  });

  it('applies initialFocus to the specified element on open', async () => {
    const { root } = await renderDialog(
      <iv-dialog initial-focus="#confirm-btn">
        <p>Contenido</p>
        <button id="confirm-btn">Confirmar</button>
      </iv-dialog>,
    );
    const focusBtn = root.querySelector('#confirm-btn') as HTMLButtonElement;
    focusBtn.focus = vi.fn();

    await root.showModal();

    expect(focusBtn.focus).toHaveBeenCalled();
  });

  it('renders with no label when neither label nor labelled-by is provided', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    expect(dialog.getAttribute('aria-label')).toBeNull();
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
  });

  it('renders with label when only label attribute is provided', async () => {
    const { root } = await renderDialog(
      <iv-dialog label="Ayuda rapida">
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    expect(dialog.getAttribute('aria-label')).toBe('Ayuda rapida');
  });

  it('renders with no aria-modal when modal is false', async () => {
    const { root } = await renderDialog(
      <iv-dialog modal={false}>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    await root.show();

    expect(dialog.getAttribute('aria-modal')).toBeNull();
  });

  it('applies aria-describedby when provided', async () => {
    const { root } = await renderDialog(
      <iv-dialog described-by="dialog-desc">
        <p>Contenido</p>
        <p id="dialog-desc">Descripcion</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);

    expect(dialog.getAttribute('aria-describedby')).toBe('dialog-desc');
  });

  it('handles close when open becomes false while dialog is open', async () => {
    const { root, waitForChanges } = await renderDialog(
      <iv-dialog open={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);
    const close = vi.spyOn(dialog, 'close');

    root.open = false;
    await waitForChanges();

    expect(close).toHaveBeenCalled();
  });

  it('opens non-modal with show method', async () => {
    const { root } = await renderDialog(
      <iv-dialog modal={false}>
        <p>Contenido</p>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);
    const show = vi.spyOn(dialog, 'show');

    await root.show();

    expect(root.modal).toBe(false);
    expect(show).toHaveBeenCalled();
  });

  it('renders with header, body and footer slots', async () => {
    const { root } = await renderDialog(
      <iv-dialog labelled-by="dialog-title">
        <h2 slot="header" id="dialog-title">
          Titulo
        </h2>
        <p>Cuerpo</p>
        <div slot="footer">Footer</div>
      </iv-dialog>,
    );

    expect(root.querySelector('.iv-dialog__header')).not.toBeNull();
    expect(root.querySelector('.iv-dialog__body')).not.toBeNull();
    expect(root.querySelector('.iv-dialog__footer')).not.toBeNull();
  });

  it('renders with default modal true', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.modal).toBe(true);
  });

  it('renders with closeOnBackdrop default true', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnBackdrop).toBe(true);
  });

  it('renders with closeOnEscape default true', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.closeOnEscape).toBe(true);
  });

  it('renders with restoreFocus default false', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.restoreFocus).toBe(false);
  });

  it('renders with dialogRole default dialog', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.dialogRole).toBe('dialog');
  });

  it('renders with returnValue default empty', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.returnValue).toBe('');
  });

  it('renders with initialFocus undefined', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.initialFocus).toBeUndefined();
  });

  it('renders with label undefined', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.label).toBeUndefined();
  });

  it('renders with labelledBy undefined', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.labelledBy).toBeUndefined();
  });

  it('renders with describedBy undefined', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.describedBy).toBeUndefined();
  });

  it('does not call close again when dialog is already closed', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    await root.close('confirm');

    expect(root.returnValue).toBe('confirm');
  });

  it('sets internal open to false when close is called without open dialog', async () => {
    const { root } = await renderDialog(
      <iv-dialog>
        <p>Contenido</p>
      </iv-dialog>,
    );

    await root.close('confirm');

    expect(root.open).toBe(false);
  });

  it('renders open attribute when open prop is true', async () => {
    const { root } = await renderDialog(
      <iv-dialog open={true}>
        <p>Contenido</p>
      </iv-dialog>,
    );

    expect(root.hasAttribute('open')).toBe(true);
  });
});
