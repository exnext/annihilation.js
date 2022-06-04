import { AnnihilationBase } from './annihilation.base';
import { IAnnihilationOptions } from './annihilation.models';

class Annihilation extends AnnihilationBase {
    renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement> {
        let { top, left, width, height } = this.PositionElement;

        let annihilationElement: HTMLElement = document.createElement('div');
        
        annihilationElement.classList.add('annihilation__content');

        annihilationElement.style.backgroundImage = `url(${canvas.toDataURL()})`;
        annihilationElement.style.top = `${top}px`;
        annihilationElement.style.left = `${left}px`;
        annihilationElement.style.width = `${width}px`;
        annihilationElement.style.height = `${height}px`;

        return annihilationElement;
    }
}

export function annihilation(options: IAnnihilationOptions): Annihilation {
    return new Annihilation(options);
}