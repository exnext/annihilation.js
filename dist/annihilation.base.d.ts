import { IAnnihilationOptions, IGridSize, IPosition } from "./annihilation.models";
import { Eventex } from '@exnext/eventex';
export declare abstract class AnnihilationBase extends Eventex {
    protected options: IAnnihilationOptions;
    protected element: HTMLElement;
    constructor(options: IAnnihilationOptions);
    get PositionElement(): IPosition;
    get GridSize(): IGridSize;
    protected abstract renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement>;
    protected createCells(annihilationElement: HTMLElement): HTMLElement | Promise<HTMLElement>;
    protected onEnd(): void;
    doIt(): void;
}
