import { r as registerInstance, h, a as Host } from './index-DQu3g8uw.js';

const ivButtonCss = () => `iv-button{display:inline-flex}.iv-button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--iv-space-sm);min-height:2.5rem;padding:0.625rem 1rem;border:1px solid transparent;border-radius:var(--iv-radius-md);font:inherit;font-size:var(--iv-font-size-sm);font-weight:700;line-height:1;text-decoration:none;cursor:pointer;transition:background-color 160ms ease,     border-color 160ms ease,     color 160ms ease,     box-shadow 160ms ease}.iv-button iv-icon{font-size:1rem}.iv-button:focus-visible{outline:none;box-shadow:var(--iv-focus-ring)}.iv-button--primary{color:var(--iv-color-primary-text);background:var(--iv-color-primary)}.iv-button--primary:hover{background:var(--iv-color-primary-hover)}.iv-button--secondary{color:var(--iv-color-text);border-color:var(--iv-color-border);background:var(--iv-color-neutral)}.iv-button--secondary:hover{background:var(--iv-color-neutral-hover)}.iv-button--ghost{color:var(--iv-color-primary);background:transparent}.iv-button--ghost:hover{background:rgb(37 99 235 / 0.08)}.iv-button:disabled,.iv-button[aria-disabled='true']{opacity:0.52;cursor:not-allowed}`;

const IvButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /** Variante visual del boton. */
        this.variant = 'primary';
        /** Tipo nativo del boton cuando no se renderiza como enlace. */
        this.type = 'button';
        /** Deshabilita la interaccion del control. */
        this.disabled = false;
        this.handleLinkClick = (event) => {
            if (!this.disabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
        };
    }
    get accessibilityAttributes() {
        return {
            'aria-label': this.label,
            'aria-labelledby': this.labelledBy,
            'aria-describedby': this.describedBy,
            'aria-controls': this.controls,
            'aria-expanded': this.toAriaValue(this.expanded),
            'aria-pressed': this.toAriaValue(this.pressed),
            'aria-haspopup': this.hasPopup,
            'aria-current': this.current,
        };
    }
    toAriaValue(value) {
        return value === undefined ? undefined : String(value);
    }
    renderLink(className) {
        return (h("a", Object.assign({ class: className, href: this.disabled ? undefined : this.href, target: this.target, rel: this.rel || (this.target === '_blank' ? 'noreferrer' : undefined), "aria-disabled": this.disabled ? 'true' : undefined, tabIndex: this.disabled ? -1 : undefined, onClick: this.handleLinkClick }, this.accessibilityAttributes), h("slot", null)));
    }
    renderButton(className) {
        return (h("button", Object.assign({ class: className, type: this.type, disabled: this.disabled }, this.accessibilityAttributes), h("slot", null)));
    }
    render() {
        const className = `iv-button iv-button--${this.variant}`;
        return (h(Host, { key: '571135e607784db0b8a66a69f3d7cd37e52142cc' }, this.href ? this.renderLink(className) : this.renderButton(className)));
    }
};
IvButton.style = ivButtonCss();

export { IvButton as iv_button };
//# sourceMappingURL=iv-button.entry.esm.js.map

//# sourceMappingURL=iv-button.entry.js.map