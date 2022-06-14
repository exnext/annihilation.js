import html2canvas from 'html2canvas';

function getCanvasByElementSize(element: HTMLElement): HTMLCanvasElement {
    let rect: DOMRect = element.getBoundingClientRect();
    let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = rect.width;
    canvas.height = rect.height;

    return canvas;
}

export function elementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    let rect: DOMRect = element.getBoundingClientRect();
    let canvas: HTMLCanvasElement = getCanvasByElementSize(element);

    return html2canvas(element, { backgroundColor: 'inherit', scale: 1, width: rect.width, height: rect.height, canvas });
}

export function elementToDataURL(element: HTMLElement): Promise<string> {
    return elementToCanvas(element)
        .then(function (canvas: HTMLCanvasElement) {
            return canvas.toDataURL();
        });
}