import html2canvas from 'html2canvas';
// import './annihilation.scss';

interface GravityPoint {
    x: number;
    y: number;
}

interface Locus<T> {
    leftTop: T;
    top: T;
    rightTop: T;
    left: T;
    center: T;
    right: T;
    leftBottom: T;
    bottom: T;
    rightBottom: T;
}

interface AnnihilationConfig {
    element: string | HTMLElement,
    columns: number,
    rows: number,
    gravityCenter?: GravityPoint,
    animationCssClass?: string,// | Locus<string>,
    time?: number | Locus<number>,
    offset?: number | Locus<number>
    inline?: boolean,
    onCreatesPartial?: OnCreatesPartial
}

export interface PartialParams {
    row: number,
    column: number,
    gravityCenter?: GravityPoint
}

type OnCreatesPartial = (element: HTMLElement, params: PartialParams) => void;

export function annihilation(config: AnnihilationConfig): Promise<string> {
    return new Promise(function (resolve, reject) {
        const element: HTMLElement = typeof config.element === 'string' ?
            <HTMLElement>document.querySelector(config.element) :
            config.element;

        let position: string;

        if (element && config.columns && config.rows) {
            html2canvas(element, { backgroundColor: 'inherit' })
                .then(function (canvas: HTMLCanvasElement) {
                    //todo: good way to cleane. It is temp...
                    if (typeof getComputedStyle !== 'undefined') {
                        position = getComputedStyle(element, null)['position'];
                    }

                    element.classList.add('annihilation');

                    let parent: HTMLElement = document.createElement('div');
                    parent.classList.add('annihilation__content');
                    parent.style.backgroundImage = `url(${canvas.toDataURL()})`;

                    parent.style.setProperty('--columns', config.columns.toString());
                    parent.style.setProperty('--rows', config.rows.toString());

                    let boxes: number = config.rows * config.columns;

                    for (let row: number = 0; row < config.rows; row++) {
                        for (let column: number = 0; column < config.columns; column++) {
                            let box: HTMLElement = document.createElement('div');
                            box.style.setProperty('--column', column.toString());
                            box.style.setProperty('--row', row.toString());

                            if (config.animationCssClass) {
                                config.animationCssClass.split(' ')
                                    .forEach(function name(params: string) {
                                        box.classList.add(params);
                                    })
                                // box.classList.add(config.animationCssClass);
                            }

                            if (config.onCreatesPartial) {
                                config.onCreatesPartial(box, {
                                    row,
                                    column,
                                    gravityCenter: config.gravityCenter
                                });
                            }

                            box.addEventListener('animationend', () => {
                                boxes--;
                                if (!boxes) {
                                    resolve(canvas.toDataURL());
                                }
                            });

                            parent.appendChild(box);
                        }
                    }

                    element.appendChild(parent);

                    //todo: good way to clean. It is temp...
                    // if (position !== undefined && !position) {
                    //     element.style.position = position;
                    // }

                    // resolve(canvas.toDataURL());
                });
        } else {
            reject('Element not found');
        }
    });
}