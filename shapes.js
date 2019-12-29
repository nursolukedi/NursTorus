
/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved.
 *
 */


//Changed according to assignment.
VertexBasedShape = function(gl, primitiveType, numVertices) {

    // arrays in which to store vertex buffers and the respective
    this.vertexBuffers = new Array();

    // remember what goemtric primitive to use for drawing
    this.primitiveType = primitiveType;

    // remember how many vertices this shape has
    this.numVertices = numVertices;

    // transformation matrix
    this.nodeTransform = mat4.identity();

    // add a vertex attribute to the shape
    this.addVertexAttribute = function(gl, attrType, dataType,
                                       numElements,dataArray) {
        this.vertexBuffers[attrType] = new VertexAttributeBuffer(gl,
            attrType, dataType,
            numElements,dataArray);
        var n = this.vertexBuffers[attrType].numVertices;
      /*  if(this.numVertices != n) {
            alert("Warning: wrong number of vertices ("
                + n + " instead of " + this.numVertices
                + ") for attribute " + attrType);
        } */
    }

    /*
       Method: draw using a vertex buffer object
    */
    this.draw = function(program,shaderMode) {
        if(shaderMode === "Phong" ){
            primitiveType = gl.LINE_STRIP;
        } else if(shaderMode === "Gourard"){
            primitiveType = gl.TRIANGLE_STRIP;
        } else if(shaderMode === "Wireframe"){
            primitiveType =gl.LINE_LOOP;
        }
        // go through all types of vertex attributes
        // and enable them before drawing
        for(attribute in this.vertexBuffers) {
            //window.console.log("activating attribute: " + attribute);
            this.vertexBuffers[attribute].makeActive(program);
        }

            program.gl.drawArrays(primitiveType, 0, this.numVertices);

    }

    this.setUniforms = function(program) {
        var matrixLocation = gl.getUniformLocation(program.glProgram, "nodeTransform");
        gl.uniformMatrix4fv(matrixLocation, false, this.nodeTransform);
    }
}
/*

   Class:  Torus
   The triangle consists of three vertices.

   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes
     are expected by its shaders

*/

Torus = function(gl, r1, r2, N, M) {

    // vertex positions
    var vposition = [];
    // vertex colors
    var vcolor = [];

    var color1 = [0,0,1];
    var color2 = [0,1,0];

    for (var i = 1; i <= N; ++i) {
        for (var j = 1; j <= M; ++j) {

            getTorusVertex(i, j, N, M, r1, r2, vposition);
            getTorusVertex(i-1, j, N, M, r1, r2, vposition);
            getTorusVertex(i-1, j-1, N, M, r1, r2, vposition);

            getTorusVertex(i, j, N, M, r1, r2, vposition);
            getTorusVertex(i, j-1, N, M, r1, r2, vposition);
            getTorusVertex(i-1, j-1, N, M, r1, r2, vposition);

            if(i%2 + j%2 == 1){
                setColor(color1, vcolor);
            } else {
                setColor(color2, vcolor);
            }

        }
    }
    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLE_STRIP, vposition.length/3);

    var vposition = new Float32Array(vposition);
    var vcolor = new Float32Array(vcolor);

    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
        vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3,
        vcolor);
}

function getTorusVertex(i,j, N, M, r1, r2, vposition){

    var v = i * 2 * Math.PI / N ;
    var u = j * 2 * Math.PI / M;

    var x = (r1 + r2 * Math.cos(u)) * Math.cos(v);
    var y = (r1 + r2 * Math.cos(u)) * Math.sin(v);
    var z = r2 * Math.sin(u);

    vposition.push(x);
    vposition.push(y);
    vposition.push(z);
}

function setColor(color, vcolor){

    vcolor.push(color[0], color[1], color[2]);
    vcolor.push(color[0], color[1], color[2]);
    vcolor.push(color[0], color[1], color[2]);
    vcolor.push(color[0], color[1], color[2]);
    vcolor.push(color[0], color[1], color[2]);
    vcolor.push(color[0], color[1], color[2]);
}


/**
 *  Class : Hyperboloid
 * */



Hyperboloid = function(gl) {

    // vertex positions
    var vposition = [];
    // vertex colors
    var vcolor = [];

    generateHyperboloidVertices(vposition, vcolor);
      // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLE_STRIP, vposition.length);

    var vpositionH = new Float32Array(vposition);
    var vcolorH = new Float32Array(vcolor);

    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
        vpositionH);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3,
        vcolorH);
}
var a1 = 0.5;
var a2 = 0.5;
var a3 = 0.5;
var e1 = 3.0 ;
var e2 = 3.0 ;
var color1 = [0,0,1];
var color2 = [0,1,0];

function generateHyperboloidVertices(vposition,vcolor) {

   for(var u = -1.0; u < 1.0; u += 0.005) {
        for(var v = -1.0; v < 1.0; v += 0.005) {
            var x = a1 * pow2(1/Math.cos(u * (Math.PI)), e1) * pow2(Math.cos(v * Math.PI), e2);
            var y = a2 * pow2(1/Math.cos(u * (Math.PI)), e1) * pow2(Math.sin(v * Math.PI), e2);
            var z = a3 * pow2(Math.tan(u * (Math.PI)), e1);

            if(x >= 2.0 )
                x = 2.0;
            else if(x <= -2.0)
                x = -2.0;
            if(y > 1.5 )
                y = 1.5;
            else if(y< -1.5)
                y= -1.5;
            if(z > 0.9 )
                z = 0.9;
            else if(z < - 0.9)
                z = -0.9;
            vposition.push(x);
            vposition.push(y);
            vposition.push(z);
            if(u%0.02 + v%0.02 === 1){
                setColor(color1, vcolor);
            } else {
                setColor(color2, vcolor);
            }
        }

    }
}


function pow2(x, y) {
    if (x < 0) {
        return -1 * (Math.pow(-x, y));
    } else {
        return Math.pow(x, y);
    }
}