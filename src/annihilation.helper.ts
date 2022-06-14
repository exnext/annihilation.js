import { IGridSize, IPosition } from "./annihilation.models";

export function getElement(element: string | HTMLElement): HTMLElement {
    return typeof element === 'string' ?
        <HTMLElement>document.querySelector(element) :
        element;
}

export function getGridSize(element: HTMLElement, columns?: number, rows?: number): IGridSize {
    let rect: DOMRect = element.getBoundingClientRect();

    columns = columns || Math.round((rows || 0) * rect.width / rect.height) || 10;
    rows = rows || Math.round(columns * rect.height / rect.width) || 10;

    return { columns, rows };
}

export function asClosedBox(element: HTMLElement): Promise<HTMLElement> {
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

export function getPosition(element: HTMLElement): IPosition {
    let rect: DOMRect = element.getBoundingClientRect();
    let rectParent: DOMRect = element.parentElement?.getBoundingClientRect() || rect;

    return {
        top: rect.top - rectParent.top,
        left: rect.left - rectParent.left,
        width: rect.width,
        height: rect.height
    }
}