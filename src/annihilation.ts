import './annihilation.scss';
import html2canvas from 'html2canvas';

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
    element: HTMLElement
}

export function annihilation(config: AnnihilationConfig): Promise<AnnihilationEnd> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = typeof config.element === 'string' ?
            <HTMLElement>document.querySelector(config.element) :
            config.element;

        if (element) {
            let rect = element.getBoundingClientRect(),
                columns: number = config.columns || 0,
                rows: number = config.rows || 0;

            columns = columns || Math.round(rows * rect.width / rect.height) || 10;
            rows = rows || Math.round(columns * rect.height / rect.width) || 10;

            html2canvas(element, { backgroundColor: 'inherit' })
                .then(function (canvas: HTMLCanvasElement) {
                    element.classList.add('annihilation');

                    let parent: HTMLElement = document.createElement('div');
                    parent.classList.add('annihilation__content');

                    parent.style.backgroundImage = `url(${canvas.toDataURL()})`;
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