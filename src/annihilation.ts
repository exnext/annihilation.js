import './annihilation.scss';
import html2canvas from 'html2canvas';

export interface IAnnihilationConfig {
    element: string | HTMLElement;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatesPartial?: OnCreatesPartial;
    onBeforeAnnihilation?: OnBeforeAnnihilation;
    onPartialAnimationEnd?: OnPartialAnimationEnd;
}

export interface IPartialParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    piece: HTMLElement
}

export type OnCreatesPartial = (params: IPartialParams) => void;

export interface IBeforeAnnihilation {
    element: HTMLElement;
}

export type OnBeforeAnnihilation = (params: IBeforeAnnihilation) => void;

export type OnPartialAnimationEnd = (pieceCount: number, params: IPartialParams) => void;


export interface IAnnihilationEnd {
    element: HTMLElement;
}

interface IGridSize {
    columns: number;
    rows: number;
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

export function annihilation0(config: IAnnihilationConfig): Promise<IAnnihilationEnd> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = getElement(config.element);

        if (element) {
            elementToDataURL(element)
                .then(function (dataURL: string) {
                    let { columns, rows } = getGridSize(element, config.columns, config.rows);

                    element.classList.add('annihilation');

                    let parent: HTMLElement = document.createElement('div');
                    parent.classList.add('annihilation__content');

                    parent.style.backgroundImage = `url(${dataURL})`;
                    parent.style.setProperty('--columns', columns.toString());
                    parent.style.setProperty('--rows', rows.toString());

                    let existsPosition: boolean = !!element.style.position;
                    let position: string = getComputedStyle(element).position;
                    if (position === 'static') {
                        element.style.position = 'relative';
                    }

                    let pieceCount: number = rows * columns;

                    for (let row: number = 0; row < rows; row++) {
                        for (let column: number = 0; column < columns; column++) {
                            let piece: HTMLElement = document.createElement('div');

                            piece.style.setProperty('--column', column.toString());
                            piece.style.setProperty('--row', row.toString());
                            piece.style.animationDelay = 0.5 * Math.random() + 's';

                            if (config.animationCssClass) {
                                config.animationCssClass.split(/\s+/g)
                                    .forEach(function name(params: string) {
                                        piece.classList.add(params);
                                    });
                            } else {
                                piece.classList.add('annihilation_animate');
                            }

                            let partial: IPartialParams = {
                                columns,
                                rows,
                                column,
                                row,
                                element,
                                piece
                            }

                            if (config.onCreatesPartial) {
                                config.onCreatesPartial(partial);
                            }

                            piece.addEventListener('animationend', () => {
                                pieceCount--;

                                if (config.onPartialAnimationEnd) {
                                    config.onPartialAnimationEnd(pieceCount, partial);
                                }

                                if (!pieceCount) {
                                    if (existsPosition) {
                                        element.style.position = position;
                                    } else {
                                        element.style.position = '';
                                    }

                                    resolve({
                                        element
                                    });
                                }
                            });

                            parent.appendChild(piece);
                        }
                    }

                    if (config.onBeforeAnnihilation) {
                        config.onBeforeAnnihilation({
                            element: parent
                        });
                    }

                    element.appendChild(parent);
                });
        } else {
            reject('Element not found');
        }
    });
}

export function annihilation(config: IAnnihilationConfig): Promise<IAnnihilationEnd> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = getElement(config.element);

        if (element) {
            asClosedBox(element)
                .then(elementToDataURL)
                .then(function (dataURL: string) {
                    let rect: DOMRect = element.getBoundingClientRect();
                    let rectParent: DOMRect = element.parentElement?.getBoundingClientRect() || rect;

                    let { columns, rows } = getGridSize(element, config.columns, config.rows);


                    element.classList.add('annihilation');

                    let parent: HTMLElement = document.createElement('div');
                    parent.classList.add('annihilation__content');

                    parent.style.backgroundImage = `url(${dataURL})`;
                    parent.style.setProperty('--columns', columns.toString());
                    parent.style.setProperty('--rows', rows.toString());
                    parent.style.top = `${rect.top - rectParent.top}px`;
                    parent.style.left = `${rect.left - rectParent.left}px`;

                    let pieceCount: number = rows * columns;

                    for (let row: number = 0; row < rows; row++) {
                        for (let column: number = 0; column < columns; column++) {
                            let piece: HTMLElement = document.createElement('div');

                            piece.style.setProperty('--column', column.toString());
                            piece.style.setProperty('--row', row.toString());
                            piece.style.animationDelay = 0.5 * Math.random() + 's';

                            if (config.animationCssClass) {
                                config.animationCssClass.split(/\s+/g)
                                    .forEach(function name(params: string) {
                                        piece.classList.add(params);
                                    });
                            } else {
                                piece.classList.add('annihilation_animate');
                            }

                            let partial: IPartialParams = {
                                columns,
                                rows,
                                column,
                                row,
                                element,
                                piece
                            }

                            if (config.onCreatesPartial) {
                                config.onCreatesPartial(partial);
                            }

                            piece.addEventListener('animationend', () => {
                                pieceCount--;

                                if (config.onPartialAnimationEnd) {
                                    config.onPartialAnimationEnd(pieceCount, partial);
                                }

                                if (!pieceCount) {
                                    resolve({
                                        element
                                    });
                                }
                            });

                            parent.appendChild(piece);
                        }
                    }

                    if (config.onBeforeAnnihilation) {
                        config.onBeforeAnnihilation({
                            element: parent
                        });
                    }

                    element.parentElement!.appendChild(parent);
                });
        } else {
            reject('Element not found');
        }
    });
}

export function annihilation2(config: IAnnihilationConfig): Promise<IAnnihilationEnd> {
    const element: HTMLElement = getElement(config.element);

    return elementToCanvas(element)
        .then(function (canvas: HTMLCanvasElement) {
            element.classList.add('annihilation');
            canvas.classList.add('annihilation__content');
            element.appendChild(canvas);

            return { element };
        });
}

export function annihilation3(config: IAnnihilationConfig): Promise<IAnnihilationEnd> {
    const element: HTMLElement = getElement(config.element);

    return asClosedBox(element)
        .then(elementToCanvas)
        .then(function (canvas: HTMLCanvasElement) {
            let rect: DOMRect = element.getBoundingClientRect();
            let rectParent: DOMRect = element.parentElement?.getBoundingClientRect() || rect;

            element.classList.add('annihilation');

            canvas.classList.add('annihilation__content');
            canvas.style.top = `${rect.top - rectParent.top}px`;
            canvas.style.left = `${rect.left - rectParent.left}px`;

            element.parentElement?.appendChild(canvas);

            return { element };
        });
}

export function annihilation4(config: IAnnihilationConfig): Promise<IAnnihilationEnd> {
    const element: HTMLElement = getElement(config.element);

    return elementToDataURL(element)
        .then(function (dataUrl: string) {
            element.classList.add('annihilation');
            let img = new Image();
            img.src = dataUrl;
            img.classList.add('annihilation__content');
            element.appendChild(img);

            return { element };
        });
}