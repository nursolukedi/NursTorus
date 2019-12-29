/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved.
 *
 */



///  Taken online and changed

function initWebGL(canvasName) {

    // the canvas / surface to be drawn to
    var canvas;

    // the result object, a WebGL render context
    var gl;

    // get the canvas DOM node identified by its ID
    canvas = window.document.getElementById(canvasName);

    // try to get a WebGL context for this canvas
    var names = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
    for (var i in names) {
        try {
            gl = canvas.getContext(names[i]);
            if (gl) { break; }
        } catch (e) { }
    }
    if (!gl) {
        window.alert("Fatal error: could not initialize WebGL context.");
    }
    return gl;
}


/*
    Function to make the current size of the canvas known to WebGL
    Parameters:
    - a WebGL context returned by initWebGL()
    - the ID of the canvas element
*/
resizeWebGL = function(gl,canvasName) {
    // get the canvas DOM node identified by its ID
    canvas = window.document.getElementById(canvasName);
    // set up the WebGL viewport transformation accoding to the canvas size
    gl.viewport(0,0,canvas.width,canvas.height);
}


/*
    Function to extract the shader source code from an HTML script node
    identified by its ID.
    Parameters:
    - the ID of the script node
    Results:
    - the contents of the script node, i.e. the shader source code
*/

getShaderSource = function(id) {

    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var result = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            result += k.textContent;
        k = k.nextSibling;
    }
    return result;
}


/*
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000/60);
        };
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
    return window.cancelCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.clearTimeout;
})();






