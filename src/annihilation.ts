import './annihilation.scss';
import html2canvas from 'html2canvas';

export interface AnnihilationConfig {
    element: string | HTMLElement;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatesPartial?: OnCreatesPartial;
}

export interface AnnihilationPromise {
    element: HTMLElement;
    dataURL: string;
}

export interface PartialParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
}

export type OnCreatesPartial = (element: HTMLElement, params: PartialParams) => void;

export function annihilation(config: AnnihilationConfig): Promise<AnnihilationPromise> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = typeof config.element === 'string' ?
            <HTMLElement>document.querySelector(config.element) :
            config.element;

        if (element) {
            let rect = element.getBoundingClientRect();

            let columns: number = config.columns || 0,
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
                    if (['absolute', 'relative'].indexOf(position) == -1) {
                        element.style.position = 'relative';
                    }

                    let boxes: number = rows * columns;

                    for (let row: number = 0; row < rows; row++) {
                        for (let column: number = 0; column < columns; column++) {
                            let box: HTMLElement = document.createElement('div');

                            box.style.setProperty('--column', column.toString());
                            box.style.setProperty('--row', row.toString());
                            box.style.animationDelay = 0.5 * Math.random() + 's';

                            if (config.animationCssClass) {
                                config.animationCssClass.split(' ')
                                    .forEach(function name(params: string) {
                                        box.classList.add(params);
                                    });
                            } else {
                                box.classList.add('annihilation_animate');
                            }

                            if (config.onCreatesPartial) {
                                config.onCreatesPartial(box, {
                                    columns,
                                    rows,
                                    column,
                                    row
                                });
                            }

                            box.addEventListener('animationend', () => {
                                boxes--;
                                if (!boxes) {
                                    if (existsPosition) {
                                        element.style.position = position;
                                    } else {
                                        element.style.position = '';
                                    }

                                    resolve({
                                        element,
                                        dataURL: canvas.toDataURL()
                                    });
                                }
                            });

                            parent.appendChild(box);
                        }
                    }

                    element.appendChild(parent);
                });
        } else {
            reject('Element not found');
        }
    });
}