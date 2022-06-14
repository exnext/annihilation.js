import { AnnihilationBase } from './annihilation.base';
import { IAnnihilationOptions, IGridSize } from './annihilation.models';
declare class AnnihilationPreview extends AnnihilationBase {
    get GridSize(): IGridSize;
    renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement>;
    protected onEnd(): void;
}
export declare function annihilationPreview(options: IAnnihilationOptions): AnnihilationPreview;
export {};
