export function getElement(element: string | HTMLElement): HTMLElement {
    return typeof element === 'string' ?
        <HTMLElement>document.querySelector(element) :
        element;
}