export var ColorGenerator = (function () {
    function ColorGenerator() {
        this.COLORS = ['#e57373', '#f06292', '#009688', '#9575cd', '#7986cb', '#64b5f6',
            '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#673ab7',
            '#ffb74d', '#a1887f', '#90a4ae'];
    }
    ColorGenerator.prototype.getColor = function (str) {
        if (str.length > 0)
            return this.COLORS[Math.abs(this.generateHashCode(str)) % this.COLORS.length];
        else
            return '#00ffffff';
    };
    ColorGenerator.prototype.generateHashCode = function (str) {
        var h = 0;
        if (str.length > 0) {
            for (var i = 0; i < str.length; i++) {
                h = 31 * h + str.charCodeAt(i);
                h |= 0; // Convert to 32bit integer
            }
        }
        return h;
    };
    ;
    return ColorGenerator;
}());
