/* 
This file implements the extrusion functionality on a box mesh.

1. On the first click, user clicks on the face he wants to extrude and the box mesh
starts stretching in the direction of the normal of the face clicked.

2. On the second click, the extrusion operation is complete and the original box 
mesh is modified.

Limitation:

1. Only 1 side can be extruded at a time and only once. User will have to
reset the scene to extrude another face of the box mesh.
*/

import * as BABYLON from 'babylonjs';

// get canvas
const canvas = document.getElementById("renderCanvas");

// create an engine
const engine = new BABYLON.Engine(canvas);

// Variable to keep track of how many times a face has been clicked
var clicks;

// declare the main scene
var mainScene;

// declare the pivot point coordinates object to keep track of the pivot point.
var pivotPointCoord;

/**
 * Method to create and render a new scene and initialize the global variables
 */
function renderSceneAndEngine() {
  pivotPointCoord = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  };

  clicks = 0;

  mainScene = createScene();

  engine.runRenderLoop(function (){
    mainScene.render();
  });
}

/**
 * Method to create a box mesh object
 * @returns a box mesh object
 */
function createBox() {
  let box = new BABYLON.MeshBuilder.CreateBox('myBox', {size: 1, height: 1, width: 1, depth: 1, updatable: true});

  // Enable highlighting of edges {

  box.enableEdgesRendering();
  box.edgesWidth = 4.0;
  box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

  // }

  // set the pivot point according to the pivotPointCoord object
  box.setPivotPoint(new BABYLON.Vector3(pivotPointCoord.x, pivotPointCoord.y, pivotPointCoord.z));

  return box;
}

/**
 * Method to create a scene and listen for click events on box mesh
 * @returns a scene
 */
function createScene() {

  // create a scene
  const scene = new BABYLON.Scene(engine);

  // Create a new box mesh (cube)
  var box = createBox();

  //create a camera
  const camera = new BABYLON.ArcRotateCamera('arc_camera',
  BABYLON.Tools.ToRadians(45),
  BABYLON.Tools.ToRadians(45),
  10.0, box, scene);

  camera.attachControl(canvas,true);

  // create a light for the scene
  const light = new BABYLON.HemisphericLight('myLight', new BABYLON.Vector3(0,1,0), scene);

  /**
   * Event listener to listen for clicks on box mesh to figure out which face is clicked
   */
  window.addEventListener("click", function(evt) {
    /**
     * if the number of clicks is 0, then get the normal of the face clicked
     * and set pivot point on the opposite face.
     */
    if(clicks === 0){
      var pickResult = scene.pick(evt.clientX, evt.clientY);
      if(pickResult.hit){
        // Get normal of the face clicked
        var normal = pickResult.getNormal();
        
        // set the pivot point on the face opposite to the face clicked
        pivotPointCoord.x = -0.5 * normal.x;
        pivotPointCoord.y = -0.5 * normal.y;
        pivotPointCoord.z = -0.5 * normal.z;

        box.setPivotPoint(new BABYLON.Vector3(pivotPointCoord.x, pivotPointCoord.y, pivotPointCoord.z));
      } 
    }
  });

  // Create a ground below the box mesh
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
  ground.position.y = -1;

  // variable to increase the scaling
  var t = 0;

  /**
   * initialize an Action Manager for the box mesh
   */
  box.actionManager = new BABYLON.ActionManager(scene);

  /**
   * register a click action, and execute the following code on click
   */
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnPickTrigger
        },
        function () { 
          /**
           * Placed the code inside setTimeout function to execute this piece
           * of code after the click event listener set on window above so that
           * the pivot point coordinates are set before running below function.
           * If setTimeout function is not used, then the click event action
           * set on box mesh is triggered first and then the click event set on
           * window is triggered, which means that the pivot point coordinates will
           * not be set correctly before they are used here.
           */
          setTimeout(() => {
            /**
             * if the number of clicks = 0, then scale the box mesh in the
             * direction of the normal of the face clicked and increment number
             * of clicks by 1.
             */
            if(clicks === 0){
              box.onBeforeRenderObservable.add(() => {
                t+= 0.01;
                if(pivotPointCoord.y === 0.0 && pivotPointCoord.z === 0.0){
                  box.scaling.set(t*0.5+2, 1, 1);
                } else if(pivotPointCoord.z === 0.0 && pivotPointCoord.z === 0.0){
                  box.scaling.set(1, t*0.5+2, 1);
                } else if(pivotPointCoord.x === 0.0 && pivotPointCoord.y === 0.0){
                  box.scaling.set(1, 1, t*0.5+2);
                }
              });
              clicks = clicks + 1;
            }else{
              /**
               * if the number of clicks = 1, then create a new box mesh and set
               * its scaling equal to the original box mesh and replace the previous
               * box mesh with the new one.
               */
              let newbox = createBox();
              newbox.scaling.set(box.scaling.x, box.scaling.y, box.scaling.z);
              scene.removeMesh(box);
              box = newbox;
            }

          }, 20);
          
        }
    )
  );

  return scene;

}

/**
 * Call the method to create and render the scene
 */
renderSceneAndEngine();


window.addEventListener('resize', function (){
  engine.resize();
});

/**
 * Additional functionality of resetting the box mesh on clicking a button.
 */
document.getElementById("resetButton").onclick = () => {
  renderSceneAndEngine();
}