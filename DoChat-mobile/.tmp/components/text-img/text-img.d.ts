import { ElementRef } from '@angular/core';
import { ColorGenerator } from './color-generator';
export declare class TextImage {
    private element;
    private colorGenerator;
    constructor(element: ElementRef, colorGenerator: ColorGenerator);
    text: string;
    bgc: string;
    badge: number;
    img: string;
}
