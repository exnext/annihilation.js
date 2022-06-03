import { AnnihilationBase } from './annihilation.base';
import { getGridSize } from './annihilation.helper';
import { IAnnihilationOptions, ICellParams } from './annihilation.models';

class Annihilation extends AnnihilationBase {
    renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement> {
        let dataURL: string = canvas.toDataURL();

        let { columns, rows } = getGridSize(this.element, this.options.columns, this.options.rows);
        let { top, left, width, height } = this.PositionElement;

        let annihilationElement: HTMLElement = document.createElement('div');
        annihilationElement.classList.add('annihilation__content');

        annihilationElement.style.backgroundImage = `url(${dataURL})`;
        annihilationElement.style.setProperty('--columns', columns.toString());
        annihilationElement.style.setProperty('--rows', rows.toString());
        annihilationElement.style.top = `${top}px`;
        annihilationElement.style.left = `${left}px`;
        annihilationElement.style.width = `${width}px`;
        annihilationElement.style.height = `${height}px`;

        let cellCount: number = rows * columns;

        for (let row: number = 0; row < rows; row++) {
            for (let column: number = 0; column < columns; column++) {
                let piece: HTMLElement = document.createElement('div');

                piece.style.setProperty('--column', column.toString());
                piece.style.setProperty('--row', row.toString());
                piece.style.animationDelay = 0.5 * Math.random() + 's';

                if (this.options.animationCssClass) {
                    this.options.animationCssClass.split(/\s+/g)
                        .forEach(function name(params: string) {
                            piece.classList.add(params);
                        });
                } else {
                    piece.classList.add('annihilation_animate');
                }

                let cell: ICellParams = {
                    columns,
                    rows,
                    column,
                    row,
                    element: this.element,
                    piece
                }

                this.emit('created-cell', cell);

                piece.addEventListener('animationend', () => {
                    cellCount--;

                    this.emit('cell-animation-end', {cellCount, cell});

                    if (!cellCount) {
                        annihilationElement.remove();
                        
                        this.onEnd();
                    }
                });

                annihilationElement.appendChild(piece);
            }
        }

        return annihilationElement;
    }
}

export function annihilation(options: IAnnihilationOptions): Annihilation {
    return new Annihilation(options);
}