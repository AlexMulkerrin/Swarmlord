/* General purpose utility functions that don't really belong
 * to a single domain. 
 */
function RGB(red,green,blue) {
    var colourString="#";
    if (red<16) colourString += "0";
    colourString += red.toString(16);
    if (green<16) colourString += "0";
    colourString += green.toString(16);
    if (blue<16) colourString += "0";
    colourString += blue.toString(16);
    return colourString;
}

function random(num) {
    return Math.floor(Math.random()*num);
}

function randomRGB() {
    var colourString="#";
    for (var i=0; i<6; i++) {
        var hexDigit = random(16);
        colourString += hexDigit.toString(16);
    }
    return colourString;
}

function changeSaturation(colour, ratio) {
    var components = [];
    components = colourComponents(colour);
    for (var i=0; i<components.length; i++) {
        components[i] = Math.floor(components[i]*ratio);
        if (components[i]>255) components[1]=255;
    }
    return RGB(components[0],components[1],components[2]);
}

function colourComponents(colour) {
    var components=[], string;
    for (var i=0; i<3; i++) {
        // "#rrggbb"
        string = colour[1+i*2]+colour[2+i*2];
        components[i]=parseInt(string,16);
    }
    return components;
}

