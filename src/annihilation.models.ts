export interface IAnnihilationOptions {
    element: string | HTMLElement;
    removeElement: boolean;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatedCell?: OnCreatedCell;
    onCellAnimationEnd?: OnCellAnimationEnd;
    onBeforeAnnihilation?: OnBeforeAnnihilation;
}

export interface ICellParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    piece: HTMLElement
}

export type OnCreatedCell = (params: ICellParams) => void;

export interface IBeforeAnnihilation {
    annihilationElement: HTMLElement;
}

export type OnBeforeAnnihilation = (params: IBeforeAnnihilation) => void;

export type OnCellAnimationEnd = (count: number, params: ICellParams) => void;


export interface IAnnihilationEnd {
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