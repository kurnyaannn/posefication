<h1 align="center">POSEFICATION</h1>

<p align="center">
  <img src="https://github.com/kurnyaannn/posefication/blob/master/misc/pose_keypoints.png?raw=true">
</p>
<h5 align="center">17 keypoints detected by PoseNet</h5>

## About
This project is just still prototype, very simple real-time pose classification, yet this project worked perfectly fine. <br>
Built using Javascript with the help of [ml5js](https://ml5js.org) and [p5js](https://p5js.org) library.<br><br>
Read <a href="https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5">this blog</a> for more information about real-time pose estimation using javascript.

## How does it work ?
<p align="center">
  <img src="https://github.com/kurnyaannn/posefication/blob/master/misc/pose_keypoints_pipeline.png?raw=true">
</p>
<h5 align="center">PoseNet Pipeline</h5>
Short answer - This project is able to classify pose based on the coordinates provided from ml5js/PoseNet library, with the help of p5js those coordinates were drawn on top of canvas with particullar size, and ml5js take those coordinates as 'inputs' for the 'dataset', and then the dataset is used to classify the pose from user in real-time by comparing the coordinates from user and the dataset.

## Requirements
* You can see all dependencies inside the `<head>` tag.
* Live Server Plugin.

## Installation
* Clone this repository using `git clone` command (or just download the `zip` version).
* Extract the cloned project.
* Enter the directory.
  ```bash
  $ cd $home/this-cloned-project
  ```
* Open the project using VSCode or anything you like as long as that code editor has Live Server Plugin enabled, otherwise this project won't work.

## Usage
* Go to Home Page or Collect Pose Page first. There's menu on top of it, you can choose which session you want.

  Below are the detailed information about each page :
* Collect Pose Page
  * After the webcam loaded you just press keyboard (except for 'S' key) to start collect the data.
  * After you pressed the key, the state will switch to 'Collecting' and then you can start collect the pose until the state switch to 'Waiting' (it's about 15s of collecting data). You can repeat this process as much as you like.
  * Press the 'S' key to save the data. Rename the data as `data.json` and save to `$this-project/data/` directory
* Train Data Page
  * This page will load the saved data from Collect Pose Page, you can see or change the loaded data name inside `$this-project/js/dataTraining.js`.
    ```javascript
    function setup() {
      ...
      brain.loadData('data/data.json', dataReady);
      ...
    }
    ```
  * The data training process may take a while depends on epoch's value.
  * After the data training process done it will automatically download 3 files, save those files to `$this-project/data/` directory with default name.
* Classify Pose Page
  * This page will load saved data from Train Data page, you can see or change the loaded data name inside `$this-project/js/dataClassification.js`.
    ```javascript
    function setup() {
      ...
      const modelInfo = {
        model: 'data/model.json',
        metadata: 'data/model_meta.json',
        weights: 'data/model.weights.bin',
      };
      ...
    }
    ```
  * After the camera loaded you can start posing, and this page will try to classify your pose based on the collected pose from Collect Pose Page.

## Cofiguration
To configure how much pose you want to save, you can customize that value inside `setup()` function inside `dataClassification.js` and `dataCollection.js`
```javascript
function setup() {
    ...
    let options = {
        inputs: 34, // How much keypoints as input, 17 keypoints consist of x and y pairs so it's 34 coordinates
        output: 4, // How much pose you want to save
        task: 'classification',
        debug: true
    }
    ...
}
```

## Guide To Collect the Data
List of 'things' that may affect the Collecting Data Process :
* Position
* Lighting
* Outfit
* Background

## License
As you can see POSEFICATION is under MIT License.

## About the Author
<a href="https://kurnyaannn.github.io">Yayang Kurnia</a>.
