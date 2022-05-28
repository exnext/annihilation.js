import './annihilation.scss';
import html2canvas from 'html2canvas';
import { toCanvas, toPng, toJpeg, toSvg } from 'html-to-image';

export interface AnnihilationConfig {
    element: string | HTMLElement;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatesPartial?: OnCreatesPartial;
    onBeforeAnnihilation?: OnBeforeAnnihilation;
    onPartialAnimationEnd?: OnPartialAnimationEnd;
}

export interface PartialParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    piece: HTMLElement
}

export type OnCreatesPartial = (params: PartialParams) => void;

export interface BeforeAnnihilation {
    element: HTMLElement;
}

export type OnBeforeAnnihilation = (params: BeforeAnnihilation) => void;

export type OnPartialAnimationEnd = (pieceCount: number, params: PartialParams) => void;


export interface AnnihilationEnd {
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
    let rect = element.getBoundingClientRect();

    columns = columns || Math.round((rows || 0) * rect.width / rect.height) || 10;
    rows = rows || Math.round(columns * rect.height / rect.width) || 10;

    return { columns, rows };
}

function getCanvasByElementSize(element: HTMLElement): HTMLCanvasElement {
    let rect = element.getBoundingClientRect();
    let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = rect.width;
    canvas.height = rect.height;

    return canvas;
}

function elementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    return html2canvas(element, { backgroundColor: 'inherit', scale: 1 });
}

function elementToDataURL(element: HTMLElement): Promise<string> {
    return elementToCanvas(element)
        .then(function (canvas: HTMLCanvasElement) {
            return canvas.toDataURL();
        });
}

export function annihilation(config: AnnihilationConfig): Promise<AnnihilationEnd> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = getElement(config.element);

        if (element) {
            elementToDataURL(element)
                .then(function name(dataURL: string) {
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

                            let partial: PartialParams = {
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




function elementToCanvas2(element: HTMLElement): Promise<HTMLCanvasElement> {
    return toCanvas(element, {
        // backgroundColor: 'initial',
        // pixelRatio: 1,//window.devicePixelRatio,
        // width: rect.width,
        // height: rect.height,
        // canvasWidth: rect.width,
        // canvasHeight: rect.height,
        // style: {
        //     margin: '0px',
        //     padding: '0px'
        // }
    });
}

function elementToDataURL2(element: HTMLElement): Promise<string> {
    return toSvg(element);
    // return toPng(element);
    // return toJpeg(element);
}

export function annihilation2(config: AnnihilationConfig): Promise<any> {
    const element: HTMLElement = getElement(config.element);

    return elementToCanvas(element)
        .then(function name(canvas: HTMLCanvasElement) {
            element.classList.add('annihilation');
            canvas.classList.add('annihilation__content');
            element.appendChild(canvas);

            return element;
        });
}

export function annihilation3(config: AnnihilationConfig): Promise<any> {
    const element: HTMLElement = getElement(config.element);

    return elementToDataURL(element)
        .then(function name(dataUrl: string) {
            element.classList.add('annihilation');
            let img = new Image();
            img.src = dataUrl;
            img.classList.add('annihilation__content');
            element.appendChild(img);

            return element;
        });
}