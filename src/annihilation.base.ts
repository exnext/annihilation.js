import { elementToCanvas } from "./annihilation.converters";
import { asClosedBox, getElement, getGridSize, getPosition } from "./annihilation.helper";
import { IAfterAnnihilation, IAnnihilationOptions, IBeforeAnnihilation, ICellAnimationEnd, ICellParams, IGridSize, IPosition } from "./annihilation.models";

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

    get PositionElement(): IPosition {
        return getPosition(this.element);
    }

    get GridSize(): IGridSize {
        return getGridSize(this.element, this.options.columns, this.options.rows);
    }

    protected abstract renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement>;

    protected createCells(annihilationElement: HTMLElement): HTMLElement | Promise<HTMLElement> {
        let { columns, rows } = this.GridSize;

        annihilationElement.style.setProperty('--columns', columns.toString());
        annihilationElement.style.setProperty('--rows', rows.toString());

        let cellsLeft: number = columns * rows;

        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                let cell: HTMLElement = document.createElement('div');

                cell.style.setProperty('--column', column.toString());
                cell.style.setProperty('--row', row.toString());
                cell.style.animationDelay = 0.5 * Math.random() + 's';

                if (this.options.animationCssClass) {
                    this.options.animationCssClass.split(/\s+/g)
                        .forEach(function name(params: string) {
                            cell.classList.add(params);
                        });
                } else {
                    cell.classList.add('annihilation_animate');
                }

                let cellParams: ICellParams = {
                    columns,
                    rows,
                    column,
                    row,
                    element: this.element,
                    cell
                }

                this.emit<ICellParams>('created-cell', cellParams);

                cell.addEventListener('animationend', () => {
                    cellsLeft--;

                    this.emit<ICellAnimationEnd>('cell-animation-end', { cellsLeft, cellParams });

                    if (!cellsLeft) {
                        annihilationElement.remove();

                        this.onEnd();
                    }
                });

                annihilationElement.appendChild(cell);
            }
        }

        return annihilationElement;
    }

    protected onEnd(): void {
        this.emit<IAfterAnnihilation>('after-annihilation', {
            element: this.element
        }).then(() => {
            this.element.classList.remove('annihilation');

            if (this.options.removeElement) {
                this.element.remove();
            }
        });
    }

    doIt(): void {
        asClosedBox(this.element)
            .then(elementToCanvas)
            .then(this.renderTo.bind(this))
            .then(this.createCells.bind(this))
            .then((annihilationElement: HTMLElement) => {
                this.element.classList.add('annihilation');

                return this.emit<IBeforeAnnihilation>('before-annihilation', {
                    annihilationElement,
                    element: this.element
                })
                    .then(() => {
                        this.element.parentElement?.appendChild(annihilationElement);
                    });
            });
    }
}