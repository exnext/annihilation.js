import { elementToCanvas } from "./annihilation.converters";
import { asClosedBox, getElement, getPosition } from "./annihilation.helper";
import { IAnnihilationOptions, IPosition } from "./annihilation.models";

import { Eventex } from '@exnext/eventex';

function getOptions(options: IAnnihilationOptions): IAnnihilationOptions {
    return Object.assign({
        removeElement: true
    }, options);
}

export abstract class AnnihilationBase extends Eventex {
    protected options!: IAnnihilationOptions;
    protected element!: HTMLElement;

    constructor(options: IAnnihilationOptions) {
        super();

        this.options = getOptions(options);
        this.element = getElement(this.options.element);
    }

    protected abstract renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement>;

    protected getRenderedElement(canvas: HTMLCanvasElement): Promise<HTMLElement> {
        return new Promise((resolve) => {
            resolve(this.renderTo(canvas));
        });
    }

    get PositionElement(): IPosition {
        return getPosition(this.element);
    }

    protected onEnd(): void {
        this.element.classList.remove('annihilation');

        if (this.options.removeElement) {
            this.element.remove();
        }
    }

    doIt(): void {
        asClosedBox(this.element)
            .then(elementToCanvas)
            .then(this.getRenderedElement.bind(this))
            .then((annihilationElement: HTMLElement) => {
                this.element.classList.add('annihilation');

                return this.emit('before-annihilation', { annihilationElement })
                    .then(() => {
                        this.element.parentElement?.appendChild(annihilationElement);
                    });
            })
            .finally(() => {
                this.emit('after-annihilation', { element: this.element });
            });
    }
}