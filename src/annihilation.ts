import html2canvas from 'html2canvas';
// import './annihilation.scss';

export enum Variables {
    variables = 'variables',
    styles = 'styles'
}

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
    animationCssClass?: string | Locus<string>,
    time?: number | Locus<number>,
    offset?: number | Locus<number>
    inline?: boolean,
    variables?: Variables
}

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

                    if (!config.variables || config.variables === Variables.variables) {
                        parent.classList.add('annihilation-variables');
                        parent.style.setProperty('--columns', config.columns.toString());
                        parent.style.setProperty('--rows', config.rows.toString());
                    }

                    for (let row: number = 0; row < config.rows; row++) {
                        for (let column: number = 0; column < config.columns; column++) {
                            let box: HTMLElement = document.createElement('div');

                            switch (config.variables) {
                                case Variables.styles:
                                    box.style.width = `calc(100% / ${config.columns})`;
                                    box.style.height = `calc(100% / ${config.rows})`;
                                    box.style.backgroundPosition = `calc(-100% * ${column}) calc(-100% * ${row})`;
                                    break;

                                case Variables.variables:
                                default:
                                    box.style.setProperty('--column', column.toString());
                                    box.style.setProperty('--row', row.toString());
                                    break;
                            }

                            parent.appendChild(box);
                        }
                    }

                    element.appendChild(parent);

                    //todo: good way to clean. It is temp...
                    // if (position !== undefined && !position) {
                    //     element.style.position = position;
                    // }

                    resolve(canvas.toDataURL());
                });
        } else {
            reject('Element not found');
        }
    });
}