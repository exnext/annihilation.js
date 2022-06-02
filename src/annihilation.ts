import './annihilation.scss';
import html2canvas from 'html2canvas';

export interface IAnnihilationOptions {
    element: string | HTMLElement;
    removeElement: boolean;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatedCell?: OnCreatedCell;
    onCellAnimationEnd?: OnCellAnimationEnd;
    onBeforeAnnihilation?: OnBeforeAnnihilation;
}

export interface ICellParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    piece: HTMLElement
}

export type OnCreatedCell = (params: ICellParams) => void;

export interface IBeforeAnnihilation {
    annihilationElement: HTMLElement;
}

export type OnBeforeAnnihilation = (params: IBeforeAnnihilation) => void;

export type OnCellAnimationEnd = (count: number, params: ICellParams) => void;


export interface IAnnihilationEnd {
    element: HTMLElement;
}

interface IGridSize {
    columns: number;
    rows: number;
}

interface IPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

function getElement(element: string | HTMLElement): HTMLElement {
    return typeof element === 'string' ?
        <HTMLElement>document.querySelector(element) :
        element;
}

function getGridSize(element: HTMLElement, columns?: number, rows?: number): IGridSize {
    let rect: DOMRect = element.getBoundingClientRect();

    columns = columns || Math.round((rows || 0) * rect.width / rect.height) || 10;
    rows = rows || Math.round(columns * rect.height / rect.width) || 10;

    return { columns, rows };
}

function getCanvasByElementSize(element: HTMLElement): HTMLCanvasElement {
    let rect: DOMRect = element.getBoundingClientRect();
    let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = rect.width;
    canvas.height = rect.height;

    return canvas;
}

function elementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    let rect: DOMRect = element.getBoundingClientRect();
    let canvas: HTMLCanvasElement = getCanvasByElementSize(element);

    return html2canvas(element, { backgroundColor: 'inherit', scale: 1, width: rect.width, height: rect.height, canvas });
}

function elementToDataURL(element: HTMLElement): Promise<string> {
    return elementToCanvas(element)
        .then(function (canvas: HTMLCanvasElement) {
            return canvas.toDataURL();
        });
}

function asClosedBox(element: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        let parent: HTMLElement = element.parentElement!;

        if (!parent) {
            reject('parentElement not found');
            return;
        }

        let existsPosition: boolean = !!parent.style.position;
        let position: string = getComputedStyle(parent).position;

        if (position === 'static') {
            parent.style.position = 'relative';
        }

        try {
            resolve(element);
        } catch (error) {
            reject(error);
        } finally {
            if (existsPosition) {
                parent.style.position = position;
            } else {
                parent.style.position = '';
            }
        }
    });
}

function getPosition(element: HTMLElement): IPosition {
    let rect: DOMRect = element.getBoundingClientRect();
    let rectParent: DOMRect = element.parentElement?.getBoundingClientRect() || rect;

    return {
        top: rect.top - rectParent.top,
        left: rect.left - rectParent.left,
        width: rect.width,
        height: rect.height
    }
}

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

export function annihilationPreview(options: IAnnihilationOptions): Promise<IAnnihilationEnd> {
    const opt: IAnnihilationOptions = getOptions(options);
    const element: HTMLElement = getElement(opt.element);

    return asClosedBox(element)
        .then(elementToCanvas)
        .then(function (canvas: HTMLCanvasElement) {
            let { top, left, width, height } = getPosition(element);

            element.classList.add('annihilation');

            canvas.classList.add('annihilation__content');
            canvas.style.top = `${top}px`;
            canvas.style.left = `${left}px`;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            element.parentElement?.appendChild(canvas);

            return { element };
        });
}