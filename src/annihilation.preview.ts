import { AnnihilationBase } from './annihilation.base';
import { IAnnihilationOptions } from './annihilation.models';

class AnnihilationPreview extends AnnihilationBase {
    renderTo(canvas: HTMLCanvasElement): HTMLElement | Promise<HTMLElement> {
        let { top, left, width, height } = this.PositionElement;

        canvas.classList.add('annihilation__content');
        
        canvas.style.top = `${top}px`;
        canvas.style.left = `${left}px`;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        return canvas;
    }
}

export function annihilationPreview(options: IAnnihilationOptions): AnnihilationPreview {
    let opt = {
        ...options,
        
        removeElement: false,
        columns: 0,
        rows: 0,
        animationCssClass: undefined
    }

    return new AnnihilationPreview(opt);
}