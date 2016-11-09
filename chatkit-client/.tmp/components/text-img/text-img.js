import { Directive, ElementRef, Input } from '@angular/core';
import { ColorGenerator } from './color-generator';
export var TextImage = (function () {
    function TextImage(element, colorGenerator) {
        this.element = element;
        this.colorGenerator = colorGenerator;
    }
    Object.defineProperty(TextImage.prototype, "text", {
        set: function (txt) {
            var bgc = this.colorGenerator.getColor(txt);
            var v = txt.charAt(0);
            this.element.nativeElement.style.backgroundColor = bgc;
            this.element.nativeElement.setAttribute("value", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextImage.prototype, "bgc", {
        set: function (hex) {
            var bgc = hex;
            this.element.nativeElement.style.backgroundColor = bgc;
        },
        enumerable: true,
        configurable: true
    });
    TextImage.decorators = [
        { type: Directive, args: [{
                    selector: 'text-img',
                    providers: [ColorGenerator]
                },] },
    ];
    /** @nocollapse */
    TextImage.ctorParameters = [
        { type: ElementRef, },
        { type: ColorGenerator, },
    ];
    TextImage.propDecorators = {
        'text': [{ type: Input },],
        'bgc': [{ type: Input },],
    };
    return TextImage;
}());
