import { AnnihilationBase } from './annihilation.base';
import { IAnnihilationOptions } from './annihilation.models';
declare class Annihilation extends AnnihilationBase {
    renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement>;
}
export declare function annihilation(options: IAnnihilationOptions): Annihilation;
export {};
