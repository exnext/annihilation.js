import './annihilation.scss';
import { asClosedBox, getElement, getGridSize, getPosition } from './annihilation.helper';
import { IAnnihilationEnd, IAnnihilationOptions, ICellParams } from './annihilation.models';
import { elementToCanvas, elementToDataURL } from './annihilation.converters';

function getOptions(options: IAnnihilationOptions): IAnnihilationOptions {
    return Object.assign({
        removeElement: true
    }, options);
}

export function annihilation(options: IAnnihilationOptions): Promise<IAnnihilationEnd> {
    return new Promise(function (resolve, reject) {
        const opt: IAnnihilationOptions = getOptions(options);
        const element: HTMLElement = getElement(opt.element);

        if (element) {
            asClosedBox(element)
                .then(elementToDataURL)
                .then(function (dataURL: string) {
                    let { columns, rows } = getGridSize(element, opt.columns, opt.rows);
                    let { top, left, width, height } = getPosition(element);

                    element.classList.add('annihilation');

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

                            if (opt.animationCssClass) {
                                opt.animationCssClass.split(/\s+/g)
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
                                element,
                                piece
                            }

                            if (opt.onCreatedCell) {
                                opt.onCreatedCell(cell);
                            }

                            piece.addEventListener('animationend', () => {
                                cellCount--;

                                if (opt.onCellAnimationEnd) {
                                    opt.onCellAnimationEnd(cellCount, cell);
                                }

                                if (!cellCount) {
                                    annihilationElement.remove();

                                    element.classList.remove('annihilation');
                                    if (opt.removeElement) {
                                        element.remove();
                                    }

                                    resolve({
                                        element
                                    });
                                }
                            });

                            annihilationElement.appendChild(piece);
                        }
                    }

                    if (opt.onBeforeAnnihilation) {
                        opt.onBeforeAnnihilation({
                            annihilationElement
                        });
                    }

                    element.parentElement!.appendChild(annihilationElement);
                });
        } else {
            reject('Element not found');
        }
    });
}

export { annihilationPreview } from './annihilation.preview';

// export function annihilationPreview(options: IAnnihilationOptions): Promise<IAnnihilationEnd> {
//     const opt: IAnnihilationOptions = getOptions(options);
//     const element: HTMLElement = getElement(opt.element);

//     return asClosedBox(element)
//         .then(elementToCanvas)
//         .then(function (canvas: HTMLCanvasElement) {
//             let { top, left, width, height } = getPosition(element);

//             element.classList.add('annihilation');

//             canvas.classList.add('annihilation__content');
//             canvas.style.top = `${top}px`;
//             canvas.style.left = `${left}px`;
//             canvas.style.width = `${width}px`;
//             canvas.style.height = `${height}px`;

//             element.parentElement?.appendChild(canvas);

//             return { element };
//         });
// }