import { IGridSize, IPosition } from "./annihilation.models";
export declare function getElement(element: string | HTMLElement): HTMLElement;
export declare function getGridSize(element: HTMLElement, columns?: number, rows?: number): IGridSize;
export declare function asClosedBox(element: HTMLElement): Promise<HTMLElement>;
export declare function getPosition(element: HTMLElement): IPosition;
