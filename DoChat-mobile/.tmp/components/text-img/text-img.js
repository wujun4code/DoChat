import { Directive, ElementRef, Input } from '@angular/core';
import { ColorGenerator } from './color-generator';
export var TextImage = (function () {
    function TextImage(element, colorGenerator) {
        this.element = element;
        this.colorGenerator = colorGenerator;
    }
    Object.defineProperty(TextImage.prototype, "text", {
        set: function (txt) {
            var txtx = txt || '';
            if (txtx.length > 0) {
                var payload = this.element.nativeElement.getAttribute("class");
                this.element.nativeElement.setAttribute("class", "hasText " + payload);
                var bgc = this.colorGenerator.getColor(txtx);
                var v = txtx.charAt(0) || '';
                this.element.nativeElement.style.backgroundColor = bgc;
                this.element.nativeElement.setAttribute("value", v);
            }
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
    Object.defineProperty(TextImage.prototype, "badge", {
        set: function (badg) {
            if (badg > 0) {
                this.element.nativeElement.setAttribute("badge", badg);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextImage.prototype, "img", {
        set: function (url) {
            var urlx = url || '';
            this.element.nativeElement.setAttribute("img", urlx);
            if (urlx.length > 0) {
                var payload = this.element.nativeElement.getAttribute("class");
                this.element.nativeElement.setAttribute("class", "hasImg " + payload);
            }
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
        'badge': [{ type: Input },],
        'img': [{ type: Input },],
    };
    return TextImage;
}());
