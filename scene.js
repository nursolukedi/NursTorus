/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved.
 *
 */

///  Taken online with tutorial  and changed.
SimpleScene = function(program, backgroundColor) {

    // remember the program
    this.program = program;

    // remember the background color
    this.bgColor = backgroundColor;

    // create empty array to store our shapes to be rendered
    this.shapes = new Array();

    // a camera used to define the transformation to clip space
    this.camera = new Camera();

    // transformation applied to the entire scene
    this.worldTransform = mat4.identity();

    /*
       Method: add a shape to the scene
    */
    this.addShape = function(shape) {
        // add shape to the end of the list
        this.shapes.push(shape);
    }


    /*
       Method: clear the scene
    */
    this.clearScene = function() {
        // add shape to the end of the list
        this.shapes = new Array();
    }

    /*
       Method: draw the scene
    */
    this.draw = function(shaderMode) {

        // shortcut to WebGL context
        var gl = this.program.gl;

        // clear the color buffer and the depth buffer; enable depth testing
        gl.clearColor(this.bgColor[0], this.bgColor[1],
            this.bgColor[2], this.bgColor[3]);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // use the correct Program; uniforms have to be set *after* this
        this.program.use();

        // calculate and set model-view matrix as uniform shader variable
        var mvLocation = gl.getUniformLocation(program.glProgram,
            "modelViewMatrix");

        // calculate and set projection matrix as uniform shader variable
        var prLocation = gl.getUniformLocation(program.glProgram,
            "projectionMatrix");

        if(mvLocation == null) {
            window.console.log("Warning: uniform modelViewMatrix not used in shader.");
        } else {
            // model view transform: first apply scene transformation,
            // then camera transformation
            var mv = mat4.create(this.camera.modelToEye());
            mv = mat4.multiply(mv,this.worldTransform);
            gl.uniformMatrix4fv(mvLocation, false, mv);
        }

        if(prLocation == null) {
            window.console.log("Warning: uniform projectionMatrix not used in shader.");
        } else {
            var pr = this.camera.eyeToClip();
            gl.uniformMatrix4fv(prLocation, false, pr);
        }
        // go through all shapes and let them draw themselves
        for(var i=0; i<this.shapes.length; i++) {
            this.shapes[i].shape.setUniforms(this.program);
            this.shapes[i].shape.draw(this.program, shaderMode);
        }

        // that's it - the buffer swap happens automatically by WebGL
    }

} // end of SimpleScene


