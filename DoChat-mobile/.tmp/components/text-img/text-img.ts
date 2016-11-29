import { Directive, ElementRef, Input } from '@angular/core';
import { ColorGenerator } from './color-generator';

@Directive({
    selector: 'text-img',
    providers: [ColorGenerator]
})
export class TextImage {

    constructor(private element: ElementRef, private colorGenerator: ColorGenerator) {

    }

    @Input()
    set text(txt: string) {
        let txtx = txt || '';
        if (txtx.length > 0) {
            let payload = this.element.nativeElement.getAttribute("class");
            this.element.nativeElement.setAttribute("class", "hasText " + payload);
            let bgc = this.colorGenerator.getColor(txtx);
            let v = txtx.charAt(0) || '';
            this.element.nativeElement.style.backgroundColor = bgc;
            this.element.nativeElement.setAttribute("value", v);
        }

    }

    @Input()
    set bgc(hex: string) {
        let bgc = hex;
        this.element.nativeElement.style.backgroundColor = bgc;
    }

    @Input()
    set badge(badg: number) {
        if (badg > 0) {
            this.element.nativeElement.setAttribute("badge", badg);
        }
    }

    @Input()
    set img(url: string) {
        let urlx = url || '';
        this.element.nativeElement.setAttribute("img", urlx);
        if (urlx.length > 0) {
            let payload = this.element.nativeElement.getAttribute("class");
            this.element.nativeElement.setAttribute("class", "hasImg " + payload);
        }
    }

}
