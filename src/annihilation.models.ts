export interface IAnnihilationOptions {
    element: string | HTMLElement;
    removeElement: boolean;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
}

export interface ICellParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    cell: HTMLElement
}

export interface IBeforeAnnihilation {
    element: HTMLElement;
    annihilationElement: HTMLElement;
}

export interface IAfterAnnihilation {
    element: HTMLElement;
}

export interface IGridSize {
    columns: number;
    rows: number;
}

export interface IPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}