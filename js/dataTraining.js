let video;
let poseNet;
let poseOptions = {
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: { width: 257, height: 200 },
    quantBytes: 2
};
let pose;
let skeleton;

let brain;
let state = 'waiting';
let targetLabel;

function setup() {
    let options = {
        inputs: 34,
        output: 4,
        task: 'classification',
        debug: true
    }
    brain = ml5.neuralNetwork(options);
    brain.loadData('data/data.json', dataReady);
}

function dataReady() {
    brain.normalizeData();
    brain.train({epochs: 100}, finished);
}

function finished() {
    console.log('data trained');
    brain.save();
}