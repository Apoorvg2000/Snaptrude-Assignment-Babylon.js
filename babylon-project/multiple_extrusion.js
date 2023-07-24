/*
This file showcases and implements the multiple extrusion functionality on the box
mesh.

1. On the first click, user can click on any face of the box and extrusion will
begin in the direction of the normal of the face clicked.

2. On the second click, the extrusion operation will be complete and the original
box modified.

3. User can then click on any other face, and repeat the steps 1 and 2.

Limitations:

1. One face can be extruded only once.
*/

import * as BABYLON from 'babylonjs';

// get canvas
const canvas = document.getElementById("renderCanvas");

// create an engine
const engine = new BABYLON.Engine(canvas);

// object to keep track of number of clicks on each face
var clicks;

// variable to keep track of whether extrusion of a side is in progress or not.
var enabled;

// declare the main scene
var mainScene;

// object to keep track of pivor point coordinates
var pivotPointCoord;

// object to keep track of the center of modified box mesh
var center;

// object to keep track of the height, width and depth od modified box mesh
var cubeSide;

// variable to keep track of which face is clicked. Each face is assigned an ID
// from 1 to 6.
var sideID;

/**
 * Method to return the sideID of the face clicked depending upon the normal of
 * the face.
 * @param {object} normal An object denoting the normal of the face clicked.
 * @returns sideID of the face clicked.
 */
function getSideID(normal) {
    if(normal.x === 1){
        return 1;
    }

    if(normal.x === -1){
        return 2;
    }

    if(normal.y === 1){
        return 3;
    }

    if(normal.y === -1){
        return 4;
    }

    if(normal.z === 1){
        return 5;
    }

    if(normal.z === -1){
        return 6;
    }
}

/**
 * Method to create and render a new scene and initialize the global variables
 */
function renderSceneAndEngine() {
  pivotPointCoord = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  };
  
  center = {
    x: 0.0,
    y: 0.0,
    z: 0.0
  }
  
  cubeSide = {
      x: 1,
      y: 1,
      z: 1
  }

  sideID = -1;
  enabled = false;
  clicks = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  mainScene = createScene();

  engine.runRenderLoop(function (){
    mainScene.render();
  });
}

/**
 * Method to create a box mesh object with dimensions taken from the cubeSide object.
 * @returns A box mesh object
 */
function createBox() {
  let box = new BABYLON.MeshBuilder.CreateBox('myBox', {height: cubeSide.y, width: cubeSide.x, depth: cubeSide.z, updatable: true});

  // Enable highlighting of edges {

  box.enableEdgesRendering();
  box.edgesWidth = 4.0;
  box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

  // }

  // set the position of the box mesh according to the center object
  box.position.x = center.x;
  box.position.y = center.y;
  box.position.z = center.z;

  // set the pivot point of the box according to the pivotPointCoord object
  box.setPivotPoint(new BABYLON.Vector3(pivotPointCoord.x, pivotPointCoord.y, pivotPointCoord.z));

  return box;
}

/**
 * Method to create a new scene and listen to any click events on box mesh and window.
 * @returns A new scene
 */
function createScene() {
  // variable to increase the scaling
  var t = 0;

  /**
   * Method to implement the extrusion functionality on the face clicked.
   * Called when the click event set on box mesh is triggered. 
   */
  function actionFunc() { 
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
       * If number of clicks on the face clicked = 0 and enabled is false, i.e,
       * extrusion of any other face is not in progress, then scale the box mesh in
       * the direction of the normal of the face clicked and set enabled = true and
       * increment the number of clicks for this face by 1.
       */
      if(clicks[sideID] === 0) {
        if(enabled === false){
          box.onBeforeRenderObservable.add(() => {
            t+= 0.01;
            if(sideID === 1 || sideID === 2){
              box.scaling.set(t*0.5+2, 1, 1);
            } else if(sideID === 3 || sideID === 4){
              box.scaling.set(1, t*0.5+2, 1);
            } else if(sideID === 5 || sideID === 6){
              box.scaling.set(1, 1, t*0.5+2);
            }
          });

          enabled = true;
          clicks[sideID] += 1;
        }
      } else {
        /**
         * 1. If the number of clicks on a face = 1, i.e, extrusion functionality
         * has been triggered for this face, then on next click event on this 
         * face, update the center and the dimensions (cubeSide) of the box mesh.
         * 
         * 2. Create a new box mesh with the same dimensions and center as the old 
         * box mesh and replace the old box with the new one.
         * 
         * 3. Increment the number of clicks for the face clicked by 1 and set
         * enabled as false.
         * 
         * 4. Reinitialize the action manager of the new box mesh and add the 
         * actionFunc to the click event on the box.
         */

        // step 1
        if(clicks[sideID] === 1) {
          let diff;
          if(sideID === 1 || sideID === 2){
            diff = cubeSide.x;
            cubeSide.x = cubeSide.x * box.scaling.x;
            diff = cubeSide.x - diff;
            center.x = center.x + (sideID === 1) ? (diff)/2.0 : (-1*diff)/2.0;
          } else if(sideID === 3 || sideID === 4){
            diff = cubeSide.y;
            cubeSide.y = (t*0.5+2) * cubeSide.y;
            diff = cubeSide.y - diff;
            center.y = center.y + (sideID === 3) ? (diff)/2.0 : (-1*diff)/2.0;
          } else if(sideID === 5 || sideID === 6){
            diff = cubeSide.z;
            cubeSide.z = (t*0.5+2) * cubeSide.z;
            diff = cubeSide.z - diff;
            center.z = center.z + (sideID === 5) ? (diff)/2.0 : (-1*diff)/2.0;
          }

          t = 0;
          
          // step 2
          let newbox = createBox();
          scene.removeMesh(box);
          box = newbox;

          // step 3
          clicks[sideID] += 1;
          enabled = false;

          // step 4
          box.actionManager = new BABYLON.ActionManager(scene);
          box.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnPickTrigger
                },
                actionFunc
            )
          );
        }
      }
  
    }, 20);
  }

  /**
   * Click event listener to detect which face of the box is clicked and update 
   * the pivot point accordingly.
   */
  window.addEventListener("click", function(evt) {
    var pickResult = scene.pick(evt.clientX, evt.clientY);
    if(pickResult.hit){
      // get the normal and sideID
      var normal = pickResult.getNormal();
      sideID = getSideID(normal);

      /**
       * If the number of clicks on the face = 0 and enabled = false, then set
       * the pivot point on the face opposite to the face clicked.
       */
      if(clicks[sideID] === 0){  
        if(enabled === false) {
          // set the pivot point on the face opposite to the face clicked
          if(sideID === 1 || sideID === 2){
            pivotPointCoord.x = -cubeSide.x * 0.5 * normal.x + center.x;
            pivotPointCoord.y = center.y;
            pivotPointCoord.z = center.z;
          } else if(sideID === 3 || sideID === 4){
            pivotPointCoord.x = center.x;
            pivotPointCoord.y = -cubeSide.y * 0.5 * normal.y + center.y;
            pivotPointCoord.z = center.z;
          } else if(sideID === 5 || sideID === 6){
            pivotPointCoord.x = center.x;
            pivotPointCoord.y = center.y;
            pivotPointCoord.z = -cubeSide.z * 0.5 * normal.z + center.z;
          }

          box.setPivotPoint(new BABYLON.Vector3(pivotPointCoord.x, pivotPointCoord.y, pivotPointCoord.z));
        }
      }
    }
  });

  // create a scene
  const scene = new BABYLON.Scene(engine);

  // create a box
  var box = createBox();

  //create a camera
  const camera = new BABYLON.ArcRotateCamera('arc_camera',
  BABYLON.Tools.ToRadians(45),
  BABYLON.Tools.ToRadians(45),
  10.0, box, scene);

  camera.attachControl(canvas,true);

  // create a light
  const light = new BABYLON.HemisphericLight('myLight', new BABYLON.Vector3(0,1,0), scene);

  // create a ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
  ground.position.y = -1;

  /**
   * Initialize an action manager of the box mesh, which listens to the click
   * events on the box and triggers the actionFunc method.
   */
  box.actionManager = new BABYLON.ActionManager(scene);
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnPickTrigger
        },
        actionFunc
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

document.getElementById("resetButton").style.visibility = "hidden";