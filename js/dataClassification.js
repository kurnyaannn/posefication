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
let poseLabel = "Loading...";

function setup() {
    let canvas = createCanvas(640, 480);
    let options = {
        inputs: 34,
        output: 4,
        task: 'classification',
        debug: true
    }
    canvas.position(350, 100);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: 'data/model.json',
        metadata: 'data/model_meta.json',
        weights: 'data/model.weights.bin',
    };
    brain.load(modelInfo, dataReady);
}

function dataReady() {
    console.log('data ready');
    classifyPose();
}

function classifyPose() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResults);
    } else {
        setTimeout(classifyPose, 100);
    }
}

function gotResults(error, hasil) {
    if (error) {
        console.log(error);
    }
    document.getElementById('selected_label').innerHTML = hasil[0].label;
    console.log(hasil);
    // console.log(result[0].confidence);
    classifyPose();
}

function modelLoaded() {
    console.log('Model Ready');
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        if (state == 'collecting') {
            let inputs = [];
            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }
            let target = [targetLabel];
            brain.addData(inputs, target);
        }
    }
}

function draw() {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);
    if (pose) {
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            if (i >= 0 && i < 5) {
                fill(255, 0, 0);
                ellipse(x, y, d / 3);
            }
            else if (i > 8 && i < 11) {
                fill(0, 0, 255);
                ellipse(x, y, d / 3);
            }
            else if (i > 14 && i < 17) {
                fill(0, 0, 255);
                ellipse(x, y, d / 3);
            }
            else {
                fill(0, 255, 0);
                ellipse(x, y, d / 3);
            }
        }
        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255, 255, 0);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
}