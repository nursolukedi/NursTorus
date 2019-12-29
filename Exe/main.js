var shaderMode = "default";

window.onload = function () {

    // initialize WebGL and compile shader program
    var canvas = window.document.getElementById("webgl_canvas");
    var gl = initWebGL("webgl_canvas");
    var vs = getShaderSource("vert_shader");
    var fs = getShaderSource("frag_shader");
    var prog = new Program(gl, vs, fs);

   /* gl.bindTexture(gl.TEXTURE_2D, texture(gl, 'crate'));
    gl.activeTexture(gl.TEXTURE0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);
*/
    // theScene is a global variable; it is accessed by the event handlers
    theScene = new SimpleScene(prog, [0.0 ,0.0, 0.0, 1.0]);

    // add an object to the scene
    var torus = new Torus(gl, 1.0, 0.5, 30, 20);
    var hyperbol = new Hyperboloid(gl, 3.0,3.0,0.5,0.5,0.5);

    mat4.translate(torus.shape.nodeTransform, [1,2,0]);
    mat4.translate(hyperbol.shape.nodeTransform, [1,2,0]);
    theScene.addShape(torus);
    theScene.addShape(hyperbol);


    // set the camera's viewpoint and viewing direction
    theScene.camera.lookAt([0,2,4], [0,0,0], [0,1,0]);

    // use the values in the HTML form to initialize the camera's projection
    updateCamera(theScene);

    // the SceneExporer handles events to manipulate the scene
    theExplorer = new SceneExplorer(canvas,theScene);
};


/*
    Event handler called whenever values in the
    "cameraParameters" form have been updated.

    The function simply reads values from the HTML form
    and calls the respective functions of the scene's
    camera object.
*/

updateCamera = function(scene) {

    var f = document.forms["cameraParameters"];
    var cam = scene.camera;
    var gl = initWebGL("webgl_canvas");

    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'projectionParameters'.");
        return;
    }

    // add shape to the scene
    if(f.elements["shape"][0].checked === true ){
            scene.clearScene();
            scene.addShape(new Torus(gl, parseFloat(f.elements["r1"].value),
            parseFloat(f.elements["r2"].value),
            parseFloat(f.elements["m"].value),
            parseFloat(f.elements["x"].value)));
    }
    else if(f.elements["shape"][1].checked === true )
    {
        scene.clearScene();
        scene.addShape(new Hyperboloid(gl) );

    }
    // add shaders and default version of it
    if(f.elements["shader_type"][0].checked === true){
        //default
        shaderMode = "default";
        scene.draw(shaderMode);
    }
       else if(f.elements["shader_type"][1].checked === true){
           //wireframe
        shaderMode = "Wireframe";
        scene.draw(shaderMode);
    }
        else if(f.elements["shader_type"][2].checked === true)
    {//phong
        shaderMode = "Phong";
        scene.draw(shaderMode);
    }
    else if(f.elements["shader_type"][3].checked === true){
        //gouraud
        shaderMode = "Gouraud";
        scene.draw(shaderMode);
    }
    // check which parametric texture mapping to use (z value change)
   if(f.elements["z_value"].checked === true) {

       if(!cam)
            alert("Cannot find camera object!!!");

        // update camera - set up perspective projection
        cam.perspective(parseFloat(f.elements["fovy"].value),
            1.0, // aspect
            parseFloat("0.0001"),
            parseFloat("1000")   );
        scene.draw(shaderMode);

    }


 }


