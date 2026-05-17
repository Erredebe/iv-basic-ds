import { beforeEach, describe, expect, h, it, render, vi } from '@stencil/vitest';
import '../iv-dialog/iv-dialog';
import './iv-dialog-close';

type DialogRender = Awaited<ReturnType<typeof render>> & {
  root: HTMLIvDialogElement;
};

const renderDialog = async (dialog: HTMLElement): Promise<DialogRender> => (await render(dialog)) as DialogRender;
const getNativeDialog = (root: HTMLElement) => root.querySelector('dialog') as HTMLDialogElement;

describe('iv-dialog-close', () => {
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

  it('renders slotted content and stores the return value', async () => {
    const { root } = await render(
      <iv-dialog-close return-value="confirm">
        <button>Confirmar</button>
      </iv-dialog-close>,
    );

    expect(root.querySelector('button')?.textContent).toBe('Confirmar');
    expect((root as HTMLIvDialogCloseElement).returnValue).toBe('confirm');
  });

  it('emits a cancelable close request when slotted content is clicked', async () => {
    const { root } = await render(
      <iv-dialog-close return-value="confirm">
        <button>Confirmar</button>
      </iv-dialog-close>,
    );
    const closeRequestListener = vi.fn();

    root.addEventListener('ivDialogCloseRequest', closeRequestListener as EventListener);
    root.querySelector('button')?.click();

    const closeRequest = closeRequestListener.mock.calls[0][0] as CustomEvent<{ returnValue: string }>;

    expect(closeRequestListener).toHaveBeenCalledTimes(1);
    expect(closeRequest.detail).toEqual({ returnValue: 'confirm' });
    expect(closeRequest.bubbles).toBe(true);
    expect(closeRequest.cancelable).toBe(true);
    expect(closeRequest.composed).toBe(true);
  });

  it('closes the nearest iv-dialog through the semantic close request', async () => {
    const { root, waitForChanges } = await renderDialog(
      <iv-dialog open={true} label="Confirmacion">
        <iv-dialog-close return-value="confirm">
          <button>Confirmar</button>
        </iv-dialog-close>
      </iv-dialog>,
    );
    const dialog = getNativeDialog(root);
    const close = vi.spyOn(dialog, 'close');

    root.querySelector('button')?.click();
    await waitForChanges();

    expect(close).toHaveBeenCalledWith('confirm');
    expect(root.open).toBe(false);
    expect(root.returnValue).toBe('confirm');
  });

  it('does not close the dialog when the close request is prevented', async () => {
    const { root, waitForChanges } = await renderDialog(
      <iv-dialog open={true} label="Confirmacion">
        <iv-dialog-close return-value="confirm">
          <button>Confirmar</button>
        </iv-dialog-close>
      </iv-dialog>,
    );
    const closeAction = root.querySelector('iv-dialog-close');
    const dialog = getNativeDialog(root);
    const close = vi.spyOn(dialog, 'close');

    closeAction?.addEventListener('ivDialogCloseRequest', event => event.preventDefault());
    root.querySelector('button')?.click();
    await waitForChanges();

    expect(close).not.toHaveBeenCalled();
    expect(root.open).toBe(true);
  });
});
