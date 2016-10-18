import {Directive, ElementRef, Input} from '@angular/core';
import {ColorGenerator} from './color-generator';

@Directive({
    selector: 'text-img',
    providers: [ColorGenerator]
})
export class TextImage {

    constructor(private element: ElementRef, private colorGenerator: ColorGenerator) { }

    @Input()
    set text(txt: string) {
        let bgc = this.colorGenerator.getColor(txt);
        let v = txt.charAt(0);
        this.element.nativeElement.style.backgroundColor = bgc;
        this.element.nativeElement.setAttribute("value", v);
    }
    @Input()
    set bgc(hex: string) {
        let bgc = hex;
        this.element.nativeElement.style.backgroundColor = bgc;
    }

}
