# Extrusion Functionality on Cube using Babylon.js

## Objective

1. Create a cube mesh object in the scene.

2. Implement the following extrusion features:

   a. User Input: Allow user to select a face to be extruded with the first mouse click, on the second click the extrusion operation should be complete and the original mesh modified.

   b. Extrusion Animation: When the user triggers the extrusion action, smoothly animate the cube's vertices to create the extrusion effect.

3. Optional: Implement additional features to enhance the user experience, such as resetting the cube, enabling multiple extrusions, or allowing for different shapes to be extruded.

## Functionalities

There are two files in this repository, `main.js` and `multiple_extrusion.js`.

1. `main.js`: This file contains the logic to implement single extrusion functionality on a cube.

   a. On first click, user can select a face to be extruded and the extrusion operation begins.

   b. On the second click, the extrusion operation will be completed and the original cube modified. Refer to the [first demo video](#demo-videos).

   c. User can only perform extrusion operation on one side at a time and only once. To perform extrusion operation on another side, reset the cube by clicking the `Reset` button on the bottom of the page.

**NOTE**: This file does not implement the multiple extrusion functionality.

2. `multiple_extrusion.js`: This file contains the logic to implement multiple extrusion functionality on a cube.

   a. On first click, user can select a face to be extruded and the extrusion operation begins.

   b. On the second click, the extrusion operation will be completed and the original cube modified. Refer to the [second demo video](#demo-videos).

   c. User can perform extrusion operation only once on a side of the cube. User can perform extrusion operation on another side of the cube by doing steps _a_ and _b_ again.

## Environment Setup

1. Make sure to have `node` and `npm` installed on your system. Refer to this [link](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac#mac) to install the latest version of node and npm on your system.

2. Make sure that the version of node >= 18. You can check the version by running the command:

```
node -v
```

Also make sure that latest version of `npm` is installed.

## Running the project

1. Clone the repository.

```
git clone https://github.com/Apoorvg2000/Snaptrude-Assignment-Babylon.js.git
```

2. In terminal, navigate to the `babylon-project` directory.

3. Run the below command to install all the modules.

```
npm install
```

4. Run the below command to run the program.

```
npm run dev
```

Open http://localhost:5173/ on your browser. Now you can start playing with the cube !!!

5. If any error occurs related to `vite` or `babylonjs`, run the below commands.

```
npm i vite
npm i babylonjs
```

Now do step 4 again to run the program.

6. To run the single extrusion operation, set the `src` property of `script` tag in `index.html` file to `main.js`. (This is set by default)

   To run the multiple extrusion operation, set the `src` property of `script` tag in `index.html` file to `multiple_extrusion.js`.

## Limitations and Bugs

1. User cannot perform extrusion operation on an already extruded side, i.e, one side can only be extruded once.

2. In multiple extrusion operation, if user clicks on a side opposite to an already extruded side, then the extrusion operation occurs but the animation is wrong. Refer to [third demo video](#demo-videos).

3. Only extrusion of cube is supported.

## Demo Videos

1. Single extrusion operation

https://github.com/Apoorvg2000/Snaptrude-Assignment-Babylon.js/assets/54017314/20073f59-13b1-47c9-8e29-27e53af85d6e

2. Multiple extrusion operation

https://github.com/Apoorvg2000/Snaptrude-Assignment-Babylon.js/assets/54017314/a7738835-f359-4382-9aa2-2adf1eb3aad8

3. Multiple extrusion operation bug

https://github.com/Apoorvg2000/Snaptrude-Assignment-Babylon.js/assets/54017314/67e33334-d7f1-4a79-b440-04dc80ff10e8

## Personal Note

I had a really fun time working on this project. This was a very interesting project for me as I have never worked on `Babylon.js` before and I got to learn so much in the last 4 days.

To think that I could implement this project in only 4 days (even though there are some flaws) is something I never would have imagined.

Although there are some limitations in this project as mentioned [above](#limitations-and-bugs), I am confident that if I had 1 or 2 more days, I could have resolved the bugs.

Thank you !!!
